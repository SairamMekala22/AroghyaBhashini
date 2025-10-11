import { ProcessingStep } from '@/types/translation';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

export const ProcessingSteps = ({ steps }: ProcessingStepsProps) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={step.name}
          className={cn(
            "flex items-center gap-4 p-4 rounded-lg transition-smooth",
            step.status === 'processing' && "bg-medical-light border border-medical-primary/30",
            step.status === 'completed' && "bg-medical-success/10 border border-medical-success/30",
            step.status === 'error' && "bg-destructive/10 border border-destructive/30",
            step.status === 'pending' && "bg-muted border border-border"
          )}
        >
          <div className="flex-shrink-0">
            {step.status === 'pending' && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
              </div>
            )}
            {step.status === 'processing' && (
              <div className="w-8 h-8 rounded-full bg-medical-primary/10 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-medical-primary animate-spin" />
              </div>
            )}
            {step.status === 'completed' && (
              <div className="w-8 h-8 rounded-full bg-medical-success flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
            {step.status === 'error' && (
              <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className={cn(
              "font-medium transition-smooth",
              step.status === 'processing' && "text-medical-primary",
              step.status === 'completed' && "text-medical-success",
              step.status === 'error' && "text-destructive"
            )}>
              {step.name}
            </h4>
            {step.message && (
              <p className="text-sm text-muted-foreground mt-1">{step.message}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
