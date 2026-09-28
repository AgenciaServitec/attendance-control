"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  id: number;
  title: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  currentStep: number;
  className?: string;
}

export function Timeline({ steps, currentStep, className }: TimelineProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full py-2", className)}>
      <ol className="relative flex w-full items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {/* Línea conectora absoluta (se dibuja entre el centro de este círculo y el siguiente) */}
              {!isLast && (
                <div className="absolute top-4 left-[50%] right-[-50%] h-[2px] -translate-y-1/2 bg-muted/60 z-0">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 ease-in-out"
                    style={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                  />
                </div>
              )}

              {/* Ícono de Estado (relativo para quedar por encima de la línea) */}
              <div
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isCompleted && "bg-emerald-500 text-white shadow-sm",
                  isCurrent &&
                    "border-2 border-primary/40 bg-muted/80 text-foreground ring-4 ring-primary/10",
                  !isCompleted &&
                    !isCurrent &&
                    "border-2 border-muted-foreground/25 bg-background text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 stroke-[3]" />
                ) : isCurrent ? (
                  <div className="size-2.5 rounded-full bg-primary" />
                ) : (
                  <div className="size-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>

              {/* Título Único totalmente centrado debajo del círculo */}
              <div className="mt-2.5 flex flex-col items-center">
                <span
                  className={cn(
                    "text-xs font-medium leading-none transition-colors",
                    isCurrent || isCompleted
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground/70",
                  )}
                >
                  {step.title}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
