import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getMedicines, markMedicineTaken } from '@/api/apiClient';
import MedicineList, { Medicine } from '@/components/MedicineList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUILanguage } from '@/contexts/UILanguageContext';

const MedicationsPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useUILanguage();
  const { toast } = useToast();

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data.medicines || []);
    } catch (error) {
      console.error('Error loading medicines:', error);
      
      // Load mock data for demo
      const mockMedicines: Medicine[] = [
        {
          id: '1',
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Twice daily',
          nextAlert: new Date(Date.now() + 3600000).toISOString(),
          taken: false,
        },
        {
          id: '2',
          name: 'Vitamin D3',
          dosage: '60000 IU',
          frequency: 'Once weekly',
          nextAlert: new Date(Date.now() + 86400000 * 7).toISOString(),
          taken: false,
        },
        {
          id: '3',
          name: 'Amoxicillin',
          dosage: '250mg',
          frequency: 'Three times daily',
          nextAlert: new Date(Date.now() + 7200000).toISOString(),
          taken: true,
        },
      ];
      setMedicines(mockMedicines);
      
      toast({
        title: 'Using Demo Data',
        description: 'Showing example medications',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkTaken = async (medicineId: string) => {
    try {
      await markMedicineTaken(medicineId);
      setMedicines((prev) =>
        prev.map((med) =>
          med.id === medicineId ? { ...med, taken: true } : med
        )
      );
      toast({
        title: '✅ Marked as Taken',
        description: 'Medicine dose recorded successfully',
      });
    } catch (error) {
      console.error('Error marking medicine as taken:', error);
      // Still update UI for demo
      setMedicines((prev) =>
        prev.map((med) =>
          med.id === medicineId ? { ...med, taken: true } : med
        )
      );
      toast({
        title: '✅ Marked as Taken',
        description: 'Medicine dose recorded (demo mode)',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('med.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('med.subtitle')}
          </p>
        </div>

        <Card className="shadow-large border-2 border-border mb-6">
          <CardHeader className="border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>💊</span> Active Medications
              </CardTitle>
              <Button variant="outline" size="sm" className="border-2">
                <Plus size={18} className="mr-2" />
                Add Medicine
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('med.loading')}</p>
              </div>
            ) : (
              <MedicineList medicines={medicines} onMarkTaken={handleMarkTaken} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-medium border-2 border-border bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-semibold mb-2">Medicine Reminder Tips</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Set alarms to match your medication schedule</li>
                  <li>• Take medicines with food unless specified otherwise</li>
                  <li>• Never skip doses without consulting your doctor</li>
                  <li>• Store medicines in a cool, dry place</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicationsPage;
