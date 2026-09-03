"use client";

import {useState} from "react";
import Map, {Marker, NavigationControl, Popup} from "react-map-gl/mapbox";
import {Wrench} from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

const MOCK_SERVICES = [
    { id: "1", title: "Reparación Eléctrica", lat: -12.046374, lng: -77.042793, status: "En curso" },
    { id: "2", title: "Mantenimiento HVAC", lat: -12.0897, lng: -77.0365, status: "Pendiente" },
    { id: "3", title: "Instalación de Redes", lat: -12.1211, lng: -77.0297, status: "Asignado" },
];

export function ServiceMap() {
    const [selectedPin, setSelectedPin] = useState<(typeof MOCK_SERVICES)[0] | null>(null);

    return (
        <div className="relative h-[calc(100vh-140px)] w-full overflow-hidden rounded-xl border border-border shadow-sm">
            <Map
                initialViewState={{
                    longitude: -77.042793,
                    latitude: -12.046374,
                    zoom: 12,
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
            >
                <NavigationControl position="top-right" />

                {MOCK_SERVICES.map((service) => (
                    <Marker
                        key={service.id}
                        longitude={service.lng}
                        latitude={service.lat}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedPin(service);
                        }}
                    >
                        <div className="flex items-center justify-center size-9 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-background">
                            <Wrench className="size-5" />
                        </div>
                    </Marker>
                ))}

                {selectedPin && (
                    <Popup
                        longitude={selectedPin.lng}
                        latitude={selectedPin.lat}
                        anchor="top"
                        onClose={() => setSelectedPin(null)}
                        className="text-xs"
                    >
                        <div className="p-1 space-y-1">
                            <p className="font-bold text-foreground">{selectedPin.title}</p>
                            <p className="text-muted-foreground">Estado: {selectedPin.status}</p>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}