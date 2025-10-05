import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pill, AlertTriangle } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  precautions: string;
}

export default function Recommendations() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Medication[]>([]);

  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Fatigue",
    "Nausea",
    "Body Pain",
    "Sore Throat",
    "Runny Nose",
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    setIsLoading(true);
    setRecommendations([]);

    // TODO: Connect to actual recommendation model endpoint
    // Simulating API call
    setTimeout(() => {
      setRecommendations([
        {
          name: "Acetaminophen",
          dosage: "500mg every 6 hours",
          precautions: "Do not exceed 4000mg per day. Avoid alcohol.",
        },
        {
          name: "Ibuprofen",
          dosage: "400mg every 8 hours",
          precautions: "Take with food. Not for patients with stomach ulcers.",
        },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Medicine Recommendations</h1>
          <p className="text-lg text-muted-foreground">
            Select your symptoms to receive AI-powered medicine recommendations
          </p>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive mb-1">Important Warning</h4>
              <p className="text-sm text-muted-foreground">
                AI recommendations are for informational purposes only. Always consult a
                healthcare professional before taking any medication.
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4">
                Select Your Symptoms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={selectedSymptoms.includes(symptom)}
                      onCheckedChange={() => toggleSymptom(symptom)}
                      disabled={isLoading}
                      data-testid={`checkbox-${symptom.toLowerCase().replace(' ', '-')}`}
                    />
                    <label
                      htmlFor={symptom}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Information (Optional)
              </label>
              <Textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any additional context about your symptoms, medical history, or concerns..."
                className="min-h-24 resize-none"
                disabled={isLoading}
                data-testid="input-additional-info"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || selectedSymptoms.length === 0}
              className="w-full"
              data-testid="button-get-recommendations"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Pill className="mr-2 w-4 h-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>
        </Card>

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recommended Medications</h2>
            {recommendations.map((med, index) => (
              <Card key={index} data-testid={`card-medication-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-chart-2/10">
                        <Pill className="w-5 h-5 text-chart-2" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{med.name}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {med.dosage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Precautions</h4>
                    <p className="text-sm text-muted-foreground">{med.precautions}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Placeholder Note:</strong> This interface is ready
            for your trained recommendation model. Connect your model API endpoint to enable real
            medicine recommendations based on symptoms.
          </p>
        </div>
      </div>
    </div>
  );
}
