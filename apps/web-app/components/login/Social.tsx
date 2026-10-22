import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  method: "phone" | "email";
  onSetMethod: Dispatch<SetStateAction<"phone" | "email">>;
}

export function Social({ method, onSetMethod }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {/* Google */}
      <Button
        variant="outline"
        type="button"
        className="flex flex-col items-center justify-center h-20 p-2 rounded-xl border-border/80 bg-background hover:bg-muted/50 transition-colors shadow-sm"
        onClick={() => console.log("Google Auth")}
      >
        <svg className="h-6 w-6 mb-1.5" viewBox="0 0 16 16">
          <path d="M0 0h16v16H0z" fill="none" />
          <path
            fill="#f44336"
            d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
            opacity=".987"
          />
          <path
            fill="#ffc107"
            d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
            opacity=".997"
          />
          <path
            fill="#448aff"
            d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
            opacity=".999"
          />
          <path
            fill="#43a047"
            d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
            opacity=".993"
          />
        </svg>
        <span className="text-xs font-medium text-foreground">Google</span>
      </Button>

      {/* Apple */}
      <Button
        variant="outline"
        type="button"
        className="flex flex-col items-center justify-center h-20 p-2 rounded-xl border-border/80 bg-background hover:bg-muted/50 transition-colors shadow-sm"
        onClick={() => console.log("Apple Auth")}
      >
        <svg
          className="h-6 w-6 mb-1.5 fill-current text-foreground"
          viewBox="0 0 32 32"
        >
          <path d="M0 0h32v32H0z" fill="none" />
          <path d="M25.425 26.498c-1.162 1.736-2.394 3.43-4.27 3.458c-1.875.042-2.477-1.106-4.605-1.106c-2.142 0-2.8 1.078-4.578 1.148c-1.834.07-3.22-1.848-4.396-3.542C5.183 23 3.35 16.63 5.813 12.346a6.84 6.84 0 0 1 5.767-3.514c1.792-.028 3.5 1.217 4.606 1.217c1.092 0 3.164-1.497 5.334-1.273a6.5 6.5 0 0 1 5.095 2.771a6.38 6.38 0 0 0-3.01 5.334a6.18 6.18 0 0 0 3.752 5.656a15.5 15.5 0 0 1-1.932 3.961M17.432 4.1A6.36 6.36 0 0 1 21.548 2a6.13 6.13 0 0 1-1.456 4.466a5.11 5.11 0 0 1-4.13 1.988a5.98 5.98 0 0 1 1.47-4.354" />
        </svg>
        <span className="text-xs font-medium text-foreground">Apple</span>
      </Button>

      {/* Email / Teléfono */}
      <Button
        variant="outline"
        type="button"
        className="flex flex-col items-center justify-center h-20 p-2 rounded-xl border-border/80 bg-background hover:bg-muted/50 transition-colors shadow-sm"
        onClick={() => onSetMethod(method === "phone" ? "email" : "phone")}
      >
        {method === "phone" ? (
          <>
            <Mail className="h-6 w-6 mb-1.5 text-foreground" />
            <span className="text-xs font-medium text-foreground">Email</span>
          </>
        ) : (
          <>
            <Phone className="h-6 w-6 mb-1.5 text-foreground" />
            <span className="text-xs font-medium text-foreground">
              Teléfono
            </span>
          </>
        )}
      </Button>

      {/* Acceso con QR */}
      {/*<Button*/}
      {/*  variant="outline"*/}
      {/*  type="button"*/}
      {/*  className="flex flex-col items-center justify-center h-20 p-2 rounded-xl border-border/80 bg-background hover:bg-muted/50 transition-colors shadow-sm"*/}
      {/*  onClick={() => console.log("Login QR")}*/}
      {/*>*/}
      {/*  <QrCode className="h-6 w-6 mb-1.5 text-foreground" />*/}
      {/*  <span className="text-xs font-medium text-foreground">Código QR</span>*/}
      {/*</Button>*/}
    </div>
  );
}
