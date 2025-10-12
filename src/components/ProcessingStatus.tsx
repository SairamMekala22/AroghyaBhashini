import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface ProcessingStatusProps {
  steps: {
    label: string;
    status: 'pending' | 'processing' | 'complete' | 'error';
  }[];
}

export const ProcessingStatus = ({ steps }: ProcessingStatusProps) => {
  return (
    <div className="w-full space-y-3 p-6 bg-card rounded-lg border border-border">
      <h3 className="font-semibold text-foreground mb-4">Processing Steps</h3>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          {step.status === 'complete' && (
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
          )}
          {step.status === 'processing' && (
            <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
          )}
          {step.status === 'pending' && (
            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
          {step.status === 'error' && (
            <Circle className="w-5 h-5 text-destructive flex-shrink-0" />
          )}
          <span className={`text-sm ${
            step.status === 'complete' 
              ? 'text-accent font-medium' 
              : step.status === 'processing'
              ? 'text-primary font-medium'
              : step.status === 'error'
              ? 'text-destructive'
              : 'text-muted-foreground'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};
