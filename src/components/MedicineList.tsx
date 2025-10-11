import { useState } from 'react';
import { Pill, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextAlert: string;
  taken: boolean;
}

interface MedicineListProps {
  medicines: Medicine[];
  onMarkTaken: (medicineId: string) => void;
}

const MedicineList = ({ medicines, onMarkTaken }: MedicineListProps) => {
  return (
    <div className="space-y-4">
      {medicines.length === 0 ? (
        <Card className="shadow-soft border-2 border-dashed border-border">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-medium">
              <Pill className="text-primary-foreground" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Medications Yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload a prescription to start tracking your medications
            </p>
          </CardContent>
        </Card>
      ) : (
        medicines.map((medicine) => (
          <Card
            key={medicine.id}
            className={`shadow-medium border-2 transition-all duration-200 hover:shadow-large ${
              medicine.taken
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-primary'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    medicine.taken ? 'bg-accent' : 'bg-gradient-primary'
                  } shadow-soft`}>
                    <Pill className="text-white" size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{medicine.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {medicine.dosage}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={medicine.taken ? 'default' : 'secondary'}
                  className={medicine.taken ? 'bg-accent' : ''}
                >
                  {medicine.taken ? (
                    <>
                      <CheckCircle2 size={14} className="mr-1" />
                      Taken
                    </>
                  ) : (
                    <>
                      <Circle size={14} className="mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>Frequency: {medicine.frequency}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>⏰</span>
                <span>Next dose: {new Date(medicine.nextAlert).toLocaleString()}</span>
              </div>
              {!medicine.taken && (
                <Button
                  onClick={() => onMarkTaken(medicine.id)}
                  className="w-full mt-2 bg-gradient-primary hover:opacity-90 shadow-soft"
                >
                  <CheckCircle2 className="mr-2" size={18} />
                  Mark as Taken
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MedicineList;
