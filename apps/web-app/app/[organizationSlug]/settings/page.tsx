"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  Building2,
  Cpu,
  MapPinned,
  Plus,
  Settings2,
  Signal,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { GeofenceMapPicker } from "@/components/geofence-map-picker";

type Tab = "geofence" | "devices" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("geofence");
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);
  const [geofenceType, setGeofenceType] = useState<"circle" | "polygon">(
    "circle",
  );
  const [polygonCoords, setPolygonCoords] = useState<number[][][]>([]);

  // Estado para capturar las coordenadas dinámicas del mapa
  const [selectedCoords, setSelectedCoords] = useState({
    lat: -12.196,
    lng: -77.014,
  });
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(50);

  // Mock Data: Sedes
  const [locations] = useState([
    {
      id: 1,
      name: "Sede Central (Villa)",
      address: "Av. Alameda San Marcos, Chorrillos",
      lat: "-12.196",
      lng: "-77.014",
      radius: "50m",
      status: "active",
    },
    {
      id: 2,
      name: "Sucursal Norte",
      address: "Av. Carlos Izaguirre 200, Independencia",
      lat: "-11.993",
      lng: "-77.055",
      radius: "100m",
      status: "active",
    },
  ]);

  // Mock Data: Dispositivos
  const [devices] = useState([
    {
      id: "dev-01",
      brand: "ZKTeco SpeedFace V5L",
      serial: "ZKT-8492019X",
      ip: "192.168.1.150",
      location: "Entrada Principal",
      status: "online",
      lastPing: "Hace 2 min",
    },
  ]);

  const handleSaveGeofence = () => {
    // AQUÍ HARÁS EL INSERT EN SUPABASE EN LA TABLA 'geofences'
    console.log("Guardando sede:", {
      name: locationName,
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng,
      radius,
    });

    setIsGeofenceModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER Y NAVEGACIÓN HORIZONTAL */}
      <div className="flex flex-col gap-4 border-b border-border pb-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Settings2 className="size-6 text-primary" />
              Configuración Corporativa
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Administra sedes, biométricos físicos y alertas del sistema.
            </p>
          </div>

          {/* Botón rápido a perfil (fuera de los tabs porque es otra ruta) */}
          <Link href="/settings/profile">
            <Button
              variant="outline"
              className="h-9 gap-2 text-xs font-bold rounded-lg shadow-sm"
            >
              <UserCircle className="size-4" />
              Mi Perfil
            </Button>
          </Link>
        </div>

        {/* TABS HORIZONTALES (Resuelve el problema de redundancia lateral) */}
        <div className="flex items-center gap-6 overflow-x-auto">
          {[
            { id: "geofence", label: "Puntos de Marcación", icon: MapPinned },
            { id: "devices", label: "Biométricos (Push)", icon: Cpu },
            { id: "notifications", label: "Alertas", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO DE LOS TABS */}
      <main className="w-full min-w-0">
        {/* GEOCERCAS */}
        {activeTab === "geofence" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Sedes y radios geográficos permitidos para marcación móvil por
                GPS.
              </p>
              <Button
                onClick={() => setIsGeofenceModalOpen(true)}
                size="sm"
                className="h-9 font-bold text-xs gap-2 rounded-lg"
              >
                <Plus className="size-4" /> Nueva Sede
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {locations.map((loc) => (
                <Card
                  key={loc.id}
                  className="p-5 flex flex-col gap-4 rounded-2xl shadow-sm border-border bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-neutral-900 dark:bg-foreground flex items-center justify-center text-white dark:text-background shrink-0">
                        <Building2 className="size-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">
                          {loc.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {loc.address}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] uppercase font-bold"
                    >
                      Activo
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-3 bg-muted/40 rounded-xl border border-border/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        Lat
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {loc.lat}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        Lng
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {loc.lng}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        Radio
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {loc.radius}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* DISPOSITIVOS (Mismo código que tenías pero ahora más ancho) */}
        {activeTab === "devices" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            {/* Contenido existente adaptado... */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Gestión de relojes de pared conectados a la nube.
              </p>
              <Button
                size="sm"
                className="h-9 font-bold text-xs gap-2 rounded-lg"
              >
                <Plus className="size-4" /> Vincular Equipo
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {devices.map((dev) => (
                <Card
                  key={dev.id}
                  className="p-5 flex flex-col sm:flex-row justify-between gap-4 rounded-2xl border-border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-600">
                      <Signal className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        {dev.brand}{" "}
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          {dev.serial}
                        </Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        IP: {dev.ip} • {dev.location}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICACIONES */}
        {activeTab === "notifications" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-300">
            <Card className="p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-bold border-b pb-2">
                Canales de Entrega
              </h3>
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">WhatsApp Business</div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">Emails</div>
                <Switch defaultChecked />
              </div>
            </Card>
            <Card className="p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-bold border-b pb-2">
                Reglas Automatizadas
              </h3>
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">Tardanzas (&gt;15 min)</div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">Faltas</div>
                <Switch defaultChecked />
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* MODAL CREAR GEOCERCA CON MAPBOX */}
      <Dialog open={isGeofenceModalOpen} onOpenChange={setIsGeofenceModalOpen}>
        <DialogContent className="sm:max-w-[560px] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Nueva Sede (Geocerca)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Haz clic o arrastra el marcador rojo en el mapa para fijar el
              punto central de marcación.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Nombre de la Sede</Label>
              <Input
                placeholder="Ej. Sede Central, Sucursal Sur"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="h-9 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setGeofenceType("circle")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  geofenceType === "circle"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Radio Circular
              </button>
              <button
                type="button"
                onClick={() => setGeofenceType("polygon")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  geofenceType === "polygon"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Polígono Libre (Escuelas)
              </button>
            </div>

            {/* Render del mapa con la propiedad radius conectada */}
            <div className="h-64 w-full rounded-xl overflow-hidden border border-border">
              <GeofenceMapPicker
                initialLat={selectedCoords.lat}
                initialLng={selectedCoords.lng}
                radius={radius}
                mode={geofenceType}
                onPositionChange={(lat, lng) => setSelectedCoords({ lat, lng })}
                onPolygonChange={(coords) => setPolygonCoords(coords)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-muted-foreground">
                  Latitud
                </Label>
                <Input
                  disabled
                  value={selectedCoords.lat.toFixed(6)}
                  className="h-8 text-xs font-mono bg-muted/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-muted-foreground">
                  Longitud
                </Label>
                <Input
                  disabled
                  value={selectedCoords.lng.toFixed(6)}
                  className="h-8 text-xs font-mono bg-muted/50"
                />
              </div>

              {geofenceType === "circle" ? (
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-muted-foreground">
                    Radio (m)
                  </Label>
                  <Input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-muted-foreground">
                    Puntos
                  </Label>
                  <Input
                    disabled
                    value={`${polygonCoords[0]?.length || 0} vértices`}
                    className="h-8 text-xs font-mono bg-muted/50 text-primary font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsGeofenceModalOpen(false)}
              className="text-xs font-bold h-9 rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveGeofence}
              className="text-xs font-bold h-9 rounded-lg"
            >
              Guardar Sede
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
