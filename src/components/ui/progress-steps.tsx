import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  className?: string;
}

const ProgressSteps = ({ steps, currentStep, completedSteps, className }: ProgressStepsProps) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isConnected = index < steps.length - 1;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    {
                      "bg-primary border-primary text-primary-foreground": isCompleted,
                      "bg-background border-primary text-primary border-4 shadow-modern": isCurrent,
                      "bg-background border-border text-muted-foreground": !isCompleted && !isCurrent,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      {
                        "text-primary": isCompleted || isCurrent,
                        "text-muted-foreground": !isCompleted && !isCurrent,
                      }
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {isConnected && (
                <div
                  className={cn(
                    "h-0.5 w-12 mx-4 transition-colors duration-300",
                    {
                      "bg-primary": index < currentStepIndex || isCompleted,
                      "bg-border": index >= currentStepIndex && !isCompleted,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ProgressSteps };
export type { Step };