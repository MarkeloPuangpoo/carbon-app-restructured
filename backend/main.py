import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Carbon Sequestration API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Supabase configuration
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")
supabase: Client = create_client(url, key)

# Constant
CARBON_CREDIT_PRICE_PER_TON = float(os.environ.get("CARBON_CREDIT_PRICE_PER_TON", 175.0))

# Pydantic models
class TreeCalculateRequest(BaseModel):
    tree_name: Optional[str] = "ต้นไม้ทั่วไป"
    circumference: float
    height: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class TreeResponse(BaseModel):
    id: Optional[int] = None
    tree_name: str
    circumference: float
    height: float
    latitude: Optional[float]
    longitude: Optional[float]
    carbon_storage: float
    carbon_value: float
    created_at: Optional[str] = None

# Calculation function (Mangrove Forest formula)
def calculate_carbon_storage_gongkang(circumference: float, height: float):
    diameter = circumference * 7 / 22  # Pi = 22/7

    # Above ground biomass (Stem, Branch, Leaf)
    WS = 0.05466 * (diameter**2 * height)**0.945
    WB = 0.01579 * (diameter**2 * height)**0.9124
    WL = 0.0678 * (diameter**2 * height)**0.5806
    WT = WS + WB + WL

    # Below ground biomass
    below_ground_biomass = WT * 0.48

    # Total biomass
    total_biomass = WT + below_ground_biomass

    # Carbon sequestration (kgCO2)
    carbon_storage = total_biomass * 0.4715 * (44 / 12)

    # Convert kgCO2 to tonCO2 and calculate value
    carbon_storage_ton = carbon_storage / 1000.0
    carbon_value = carbon_storage_ton * CARBON_CREDIT_PRICE_PER_TON

    return {
        "carbon_storage": carbon_storage,
        "WS": WS,
        "WB": WB,
        "WL": WL,
        "WT": WT,
        "below_ground_biomass": below_ground_biomass,
        "total_biomass": total_biomass,
        "carbon_value": carbon_value
    }

@app.get("/")
def read_root():
    return {"message": "Carbon Sequestration API is running"}

@app.post("/calculate", response_model=TreeResponse)
async def calculate_and_save(request: TreeCalculateRequest):
    try:
        # 1. Perform calculation
        calc_results = calculate_carbon_storage_gongkang(request.circumference, request.height)
        
        # 2. Prepare data for Supabase
        tree_data = {
            "tree_name": request.tree_name,
            "circumference": request.circumference,
            "height": request.height,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "carbon_storage": calc_results["carbon_storage"],
            "carbon_value": calc_results["carbon_value"]
        }
        
        # 3. Save to Supabase
        response = supabase.table("trees").insert(tree_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save data to database")
            
        # Return the saved record (includes ID and created_at)
        return response.data[0]
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/trees", response_model=List[TreeResponse])
async def get_all_trees():
    try:
        response = supabase.table("trees").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import io
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
import pandas as pd

# ... (Previous imports and setup)

@app.get("/template")
async def get_template():
    """Generate a sample Excel template for users to download"""
    df = pd.DataFrame({
        "tree_name": ["ต้นโกงกาง-01", "ต้นโกงกาง-02"],
        "circumference": [30.5, 45.2],
        "height": [8.5, 12.0],
        "latitude": [13.5, 13.6],
        "longitude": [101.0, 101.1]
    })
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Trees')
    
    output.seek(0)
    headers = {
        'Content-Disposition': 'attachment; filename="carbon_calculation_template.xlsx"'
    }
    return StreamingResponse(output, headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

@app.post("/upload")
async def upload_bulk(file: UploadFile = File(...)):
    """Process bulk upload from Excel or CSV"""
    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        required_cols = ['circumference', 'height']
        if not all(col in df.columns for col in required_cols):
            raise HTTPException(status_code=400, detail="Missing required columns: circumference, height")

        # Fill optional columns
        if 'tree_name' not in df.columns: df['tree_name'] = "ต้นไม้ทั่วไป"
        df['latitude'] = df.get('latitude', None)
        df['longitude'] = df.get('longitude', None)

        results = []
        for _, row in df.iterrows():
            calc = calculate_carbon_storage_gongkang(row['circumference'], row['height'])
            results.append({
                "tree_name": row['tree_name'] if pd.notna(row['tree_name']) else "ต้นไม้ทั่วไป",
                "circumference": float(row['circumference']),
                "height": float(row['height']),
                "latitude": float(row['latitude']) if pd.notna(row['latitude']) else None,
                "longitude": float(row['longitude']) if pd.notna(row['longitude']) else None,
                "carbon_storage": calc["carbon_storage"],
                "carbon_value": calc["carbon_value"]
            })

        # Insert into Supabase
        response = supabase.table("trees").insert(results).execute()
        
        return {
            "message": f"Successfully processed {len(results)} trees",
            "count": len(results),
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
