import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, Brain, GitBranch, TrendingUp } from "lucide-react";
import aiNetworkImage from "@assets/stock_images/artificial_intellige_bc38a85f.jpg";
import researchLabImage from "@assets/stock_images/medical_research_lab_9ef4ff86.jpg";

export default function Research() {
  const datasets = [
    {
      name: "MedQuAD",
      description: "Medical Question Answering Dataset",
      size: "47,457 medical Q&A pairs",
      coverage: "Multiple medical specialties including NIH, CDC sources",
    },
  ];

  const models = [
    {
      name: "RAG-based Medical Q&A",
      type: "Retrieval-Augmented Generation",
      description: "Combines large language models with medical knowledge retrieval for accurate question answering",
      architecture: "Encoder-Decoder with Vector Database",
    },
    {
      name: "Medicine Recommendation System",
      type: "Symptom Analysis & Classification",
      description: "Analyzes patient symptoms to recommend appropriate medications with dosage and precautions",
      architecture: "Multi-class Classification with Decision Trees",
    },
  ];

  const methodology = [
    {
      step: "Data Collection",
      description: "Gathered comprehensive medical Q&A pairs from MedQuAD dataset covering multiple specialties",
    },
    {
      step: "Preprocessing",
      description: "Cleaned and normalized medical text, created embeddings for efficient retrieval",
    },
    {
      step: "Model Training",
      description: "Fine-tuned models on medical corpus with domain-specific optimization",
    },
    {
      step: "Evaluation",
      description: "Validated accuracy against medical benchmarks and expert review",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Research & Methodology</h1>
          <p className="text-lg text-muted-foreground">
            Detailed information about our AI models, training datasets, and research approach
          </p>
        </div>

        <Tabs defaultValue="datasets" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="datasets" data-testid="tab-datasets">Datasets</TabsTrigger>
            <TabsTrigger value="models" data-testid="tab-models">AI Models</TabsTrigger>
            <TabsTrigger value="methodology" data-testid="tab-methodology">Methodology</TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="mt-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                {datasets.map((dataset, index) => (
                  <Card key={index} data-testid={`card-dataset-${index}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Database className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{dataset.name}</CardTitle>
                          <CardDescription>{dataset.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Badge variant="secondary">{dataset.size}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Coverage:</strong> {dataset.coverage}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src={aiNetworkImage}
                  alt="AI Network Visualization"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models" className="mt-8 space-y-6">
            <div className="grid gap-6">
              {models.map((model, index) => (
                <Card key={index} data-testid={`card-model-${index}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-chart-2/10">
                        <Brain className="w-5 h-5 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge>{model.type}</Badge>
                      <Badge variant="outline">{model.architecture}</Badge>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Model Placeholder:</strong> This
                        section is ready for your trained model architecture diagrams and
                        specifications. Connect your model details here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={researchLabImage}
                alt="Research Laboratory"
                className="w-full h-48 object-cover"
              />
            </div>
          </TabsContent>

          <TabsContent value="methodology" className="mt-8 space-y-6">
            <div className="space-y-4">
              {methodology.map((item, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-methodology-${index}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-xl">{item.step}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-muted/30">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Training Results</CardTitle>
                    <CardDescription>
                      Model performance metrics and evaluation results
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-card rounded-lg">
                    <p className="text-3xl font-bold text-primary">95%</p>
                    <p className="text-sm text-muted-foreground mt-1">Accuracy Target</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <p className="text-3xl font-bold text-chart-2">2</p>
                    <p className="text-sm text-muted-foreground mt-1">AI Models</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <p className="text-3xl font-bold text-chart-3">47K+</p>
                    <p className="text-sm text-muted-foreground mt-1">Training Samples</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
