import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pill, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: MessageSquare,
      title: "Medical Q&A",
      description: "Ask medical questions and receive AI-powered answers backed by the MedQuAD dataset. Our RAG-based system retrieves relevant medical knowledge to provide accurate, contextual responses.",
      gradient: "from-primary/20 to-primary/5",
      borderColor: "border-primary/20",
      href: "/qa",
      testId: "card-qa"
    },
    {
      icon: Pill,
      title: "Medicine Recommendations",
      description: "Input your symptoms and receive intelligent medicine recommendations. Our AI analyzes symptom patterns to suggest appropriate medications with dosage and precaution information.",
      gradient: "from-chart-2/20 to-chart-2/5",
      borderColor: "border-chart-2/20",
      href: "/recommendations",
      testId: "card-recommendations"
    }
  ];

  return (
    <section className="py-20" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our AI Services</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience cutting-edge medical AI technology with our two flagship services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-2 ${service.borderColor} hover-elevate`}
              data-testid={service.testId}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-50`} />
              <CardHeader className="relative">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button
                  onClick={() => window.location.href = service.href}
                  data-testid={`button-try-${service.testId}`}
                >
                  Try Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
