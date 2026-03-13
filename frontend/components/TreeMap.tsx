"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function TreeMap() {
  const [trees, setTrees] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/trees")
      .then((res) => res.json())
      .then((data) => setTrees(data))
      .catch((err) => console.error(err));
  }, []);

  const getMarkerColor = (carbon: number) => {
    if (carbon > 100) return "#059669"; // High (Emerald)
    if (carbon > 50) return "#f59e0b";  // Medium (Amber)
    return "#f43f5e";                   // Low (Rose)
  };

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden">
      <MapContainer 
        center={[13.736717, 100.523186]} 
        zoom={7} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees.filter(t => t.latitude && t.longitude).map((tree) => (
          <CircleMarker
            key={tree.id}
            center={[tree.latitude, tree.longitude]}
            radius={12}
            pathOptions={{
              fillColor: getMarkerColor(tree.carbon_storage),
              color: "white",
              weight: 2,
              fillOpacity: 0.9,
            }}
          >
            <Popup className="sarabun-popup">
              <div className="p-2 space-y-1">
                <p className="font-bold text-emerald-900 border-b border-emerald-100 pb-1 mb-1">{tree.tree_name}</p>
                <p className="text-xs text-slate-500">กักเก็บคาร์บอน:</p>
                <p className="font-bold text-lg text-emerald-600">{tree.carbon_storage.toFixed(2)} kg CO₂</p>
                <p className="text-xs text-slate-500">มูลค่าโดยประมาณ:</p>
                <p className="font-bold text-amber-600">฿{tree.carbon_value.toFixed(2)}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
