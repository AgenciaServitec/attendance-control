"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { MapPin, Spline, Trash2 } from "lucide-react";
import circle from "@turf/circle";
import { point } from "@turf/helpers";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

interface GeofenceMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  radius?: number; // En metros (para el modo circular)
  mode?: "circle" | "polygon";
  onPositionChange: (lat: number, lng: number) => void;
  onPolygonChange?: (coordinates: number[][][]) => void;
}

export function GeofenceMapPicker({
  initialLat = -12.196021,
  initialLng = -77.013861,
  radius = 50,
  mode = "circle",
  onPositionChange,
  onPolygonChange,
}: GeofenceMapPickerProps) {
  const [marker, setMarker] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [hasPolygon, setHasPolygon] = useState(false);

  const mapRef = useRef<any>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Círculo dinámico para modo "circle"
  const geofenceCircleGeoJSON = useMemo(() => {
    if (mode !== "circle" || !marker.latitude || !marker.longitude) return null;
    const centerPoint = point([marker.longitude, marker.latitude]);
    return circle(centerPoint, radius / 1000, { units: "kilometers" });
  }, [marker.latitude, marker.longitude, radius, mode]);

  // Actualizar Polígono en el callback padre
  const updatePolygonData = useCallback(() => {
    if (!drawRef.current) return;
    const data = drawRef.current.getAll();
    if (data.features.length > 0) {
      setHasPolygon(true);
      const feature = data.features[0];
      if (feature.geometry.type === "Polygon" && onPolygonChange) {
        onPolygonChange(feature.geometry.coordinates as number[][][]);
      }
    } else {
      setHasPolygon(false);
      if (onPolygonChange) onPolygonChange([]);
    }
  }, [onPolygonChange]);

  // Manejar el ciclo de vida de MapboxDraw según el modo
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (mode === "polygon") {
      if (!drawRef.current) {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          defaultMode: "draw_polygon",
          styles: [
            // Estilo del polígono mientras se dibuja o ya dibujado
            {
              id: "gl-draw-polygon-fill",
              type: "fill",
              filter: ["all", ["==", "$type", "Polygon"]],
              paint: {
                "fill-color": "#2563eb",
                "fill-opacity": 0.25,
              },
            },
            {
              id: "gl-draw-polygon-stroke",
              type: "line",
              filter: ["all", ["==", "$type", "Polygon"]],
              paint: {
                "line-color": "#2563eb",
                "line-width": 2.5,
              },
            },
            {
              id: "gl-draw-polygon-midpoint",
              type: "circle",
              filter: ["all", ["==", "$type", "Point"]],
              paint: {
                "circle-radius": 5,
                "circle-color": "#2563eb",
              },
            },
          ],
        });

        map.addControl(draw);
        drawRef.current = draw;

        map.on("draw.create", updatePolygonData);
        map.on("draw.update", updatePolygonData);
        map.on("draw.delete", updatePolygonData);

        setIsDrawing(true);
      }
    } else {
      // Si cambia a modo círculo, limpiamos la herramienta de dibujo
      if (drawRef.current) {
        map.off("draw.create", updatePolygonData);
        map.off("draw.update", updatePolygonData);
        map.off("draw.delete", updatePolygonData);
        map.removeControl(drawRef.current);
        drawRef.current = null;
        setIsDrawing(false);
        setHasPolygon(false);
      }
    }
  }, [mode, updatePolygonData]);

  const handleStartDraw = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
      drawRef.current.changeMode("draw_polygon");
      setIsDrawing(true);
      setHasPolygon(false);
    }
  };

  const handleClearDraw = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
      updatePolygonData();
      setIsDrawing(false);
    }
  };

  const handleMapClick = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      if (mode === "polygon") return;
      const { lat, lng } = e.lngLat;
      setMarker({ latitude: lat, longitude: lng });
      onPositionChange(lat, lng);
    },
    [onPositionChange, mode],
  );

  const handleMarkerDragEnd = useCallback(
    (e: mapboxgl.MarkerDragEvent) => {
      const { lat, lng } = e.lngLat;
      setMarker({ latitude: lat, longitude: lng });
      onPositionChange(lat, lng);
    },
    [onPositionChange],
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-center justify-center text-xs font-bold text-destructive">
        Falta configurar NEXT_PUBLIC_MAPBOX_TOKEN en tu archivo .env.local
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border shadow-inner">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: marker.longitude,
          latitude: marker.latitude,
          zoom: 15,
        }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {/* MODO CIRCULO */}
        {mode === "circle" && geofenceCircleGeoJSON && (
          <Source
            id="geofence-circle"
            type="geojson"
            data={geofenceCircleGeoJSON}
          >
            <Layer
              id="geofence-fill"
              type="fill"
              paint={{ "fill-color": "#2563eb", "fill-opacity": 0.2 }}
            />
            <Layer
              id="geofence-border"
              type="line"
              paint={{ "line-color": "#2563eb", "line-width": 2 }}
            />
          </Source>
        )}

        {/* PIN DEL CENTRO (Solo en modo círculo) */}
        {mode === "circle" && (
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            draggable
            onDragEnd={handleMarkerDragEnd}
          >
            <div className="flex flex-col items-center group cursor-grab active:cursor-grabbing">
              <div className="px-2 py-0.5 rounded-md bg-neutral-900 text-white text-[10px] font-bold shadow-md mb-1 animate-bounce">
                Mueve el centro
              </div>
              <MapPin className="size-8 text-primary fill-primary/20 drop-shadow-md" />
            </div>
          </Marker>
        )}
      </Map>

      {/* BOTONES DE CONTROL FLOTANTE PARA MODO POLÍGONO (EXCELENTE UX EN MÓVIL Y DESKTOP) */}
      {mode === "polygon" && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-background/90 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-md">
          <button
            type="button"
            onClick={handleStartDraw}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all active:scale-95"
          >
            <Spline className="size-3.5" />
            <span>{hasPolygon ? "Redibujar Périmetro" : "Trazar Puntos"}</span>
          </button>

          {hasPolygon && (
            <button
              type="button"
              onClick={handleClearDraw}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-destructive/10 text-destructive text-xs font-bold transition-all active:scale-95"
            >
              <Trash2 className="size-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      )}

      {/* INSTRUCCIÓN DE USO EN PANTALLA */}
      {mode === "polygon" && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-neutral-900/90 text-white text-[11px] font-bold backdrop-blur-md border border-neutral-700 pointer-events-none shadow-md text-center max-w-[90%] truncate">
          {hasPolygon
            ? "✓ Polígono delimitado con éxito"
            : "Haz clic en el mapa para marcar los puntos de la escuela"}
        </div>
      )}
    </div>
  );
}
