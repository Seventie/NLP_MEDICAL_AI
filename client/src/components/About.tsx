import { Card } from "@/components/ui/card";
import { Database, Brain, TrendingUp } from "lucide-react";

export default function About() {
  const stats = [
    {
      icon: Database,
      label: "Datasets",
      value: "MedQuAD",
      description: "Medical Question Answering"
    },
    {
      icon: Brain,
      label: "AI Models",
      value: "2",
      description: "RAG Q&A & Recommendations"
    },
    {
      icon: TrendingUp,
      label: "Coverage",
      value: "Wide",
      description: "Multiple Medical Domains"
    }
  ];

  return (
    <section className="py-20 bg-muted/30" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Our Medical AI Platform
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our advanced medical AI platform leverages state-of-the-art Retrieval-Augmented
              Generation (RAG) technology to provide accurate medical question answering and
              intelligent medicine recommendations.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Trained on the comprehensive MedQuAD dataset, our system combines the power of
              large language models with medical knowledge retrieval to deliver trustworthy
              healthcare insights. Whether you need answers to medical questions or personalized
              medicine recommendations, our AI assistants are here to help.
            </p>
            <p className="text-base text-muted-foreground">
              <strong className="text-foreground">Important:</strong> This platform provides
              AI-generated medical information for educational and research purposes. Always
              consult with qualified healthcare professionals for medical advice.
            </p>
          </div>

          <div className="md:col-span-2 space-y-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover-elevate" data-testid={`card-stat-${index}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
