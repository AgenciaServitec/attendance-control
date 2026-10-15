"use client";

import { useEffect, useState } from "react";
import { Info, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";

import "@aws-amplify/ui-react-liveness/styles.css";

import {
  createLivenessSession,
  getLivenessResult,
} from "@/app/actions/liveness-actions";

interface LivenessDetectorProps {
  onSuccess: (referenceImage: any) => void;
  onError: (msg: string) => void;
}

export function LivenessDetector({
  onSuccess,
  onError,
}: LivenessDetectorProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  async function initSession() {
    setLoading(true);
    setSessionId(null);
    setCredentials(null);

    try {
      const res = await createLivenessSession();

      if (res.success && res.sessionId && res.credentials) {
        setSessionId(res.sessionId);
        setCredentials(res.credentials);
      } else {
        onError(res.error || "No se pudo crear la sesión biométrica");
      }
    } catch (err: any) {
      onError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initSession();
  }, []);

  const handleAnalysisComplete = async () => {
    if (!sessionId) return;
    setLoading(true);

    const result = await getLivenessResult(sessionId);

    if (result.success && result.isLive) {
      onSuccess(result.referenceImage);
    } else {
      onError(
        `Registro no completado (${
          result.confidence?.toFixed(0) || 0
        }% de confianza). Intenta en un lugar mejor iluminado.`,
      );
    }
    setLoading(false);
  };

  const handleDetectorError = (err: any) => {
    console.error("Error Liveness Detector:", err);
    if (
      err?.message?.includes("expired") ||
      err?.state === "SERVER_ERROR" ||
      err?.message?.includes("credentials")
    ) {
      initSession();
    } else {
      onError(err?.message || "Error en el sensor biométrico");
    }
  };

  if (loading || !sessionId || !credentials) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card border-2 border-border p-8 min-h-[300px]">
        <Loader2 className="size-8 animate-spin text-primary" />
        <div className="flex flex-col items-center text-center gap-1">
          <span className="text-sm font-bold text-foreground">
            Generando credenciales biométricas
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            Estableciendo sesión fresca con AWS Rekognition...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            Captura de patrón facial inicial
          </span>
        </div>
        <button
          type="button"
          onClick={initSession}
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="size-3" />
          <span>Reiniciar cámara</span>
        </button>
      </div>

      <div
        className="relative rounded-2xl border-2 border-border overflow-hidden bg-neutral-950 shadow-none min-h-[320px]"
        style={
          {
            "--amplify-colors-brand-primary-10": "var(--primary)",
            "--amplify-colors-brand-primary-80": "var(--primary)",
            "--amplify-colors-brand-primary-90": "var(--primary)",
            "--amplify-colors-brand-primary-100": "var(--primary)",
            "--amplify-radii-medium": "var(--radius-lg)",
            "--amplify-font-family": "var(--font-sans)",
            // Ajustamos el tamaño global de las fuentes internas de Amplify por si acaso
            "--amplify-font-sizes-large": "1rem",
            "--amplify-font-sizes-xl": "1.125rem",
            "--amplify-font-sizes-xxl": "1.25rem",
          } as React.CSSProperties
        }
      >
        <FaceLivenessDetector
          key={sessionId}
          sessionId={sessionId}
          region={process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1"}
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleDetectorError}
          config={
            {
              credentialProvider: async () => ({
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
                sessionToken: credentials.sessionToken,
              }),
            } as any
          }
          // AQUÍ SE REEMPLAZA EL COMPONENTE GIGANTE POR UNO TUYO
          components={{
            PhotosensitiveWarning: (): React.JSX.Element => {
              return (
                <div className="m-3 sm:m-4 p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col gap-1.5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Info className="size-4 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">
                      Aviso de iluminación
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
                    Esta prueba utiliza secuencias de luz para confirmar tu
                    presencia física. Ten precaución si eres sensible a los
                    destellos.
                  </p>
                </div>
              );
            },
          }}
          displayText={{
            startScreenBeginCheckText: "Iniciar captura de rostro",
            hintCenterFaceText: "Centra tu rostro en la pantalla",
            hintCenterFaceInstructionText:
              "Ubícate de frente dentro del marco ovalado",
            hintTooFarText: "Acerca un poco tu rostro",
            hintTooCloseText: "Aleja un poco tu rostro",
            hintTooManyFacesText: "Asegúrate de que solo aparezca un rostro",
            hintHoldFaceForFreshnessText: "Mantén la posición un momento...",
            hintCanNotIdentifyText: "Colócate frente a la cámara",
            hintVerifyingText: "Procesando prueba biométrica...",
            hintCheckCompleteText: "Captura completada",
            tryAgainText: "Reintentar captura",
            serverHeaderText: "Error de servidor",
            serverMessageText:
              "La sesión expiró. Presiona el botón de reiniciar para intentar de nuevo.",
          }}
        />
      </div>
    </div>
  );
}
