import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Pill } from "lucide-react";
import heroImage from "@assets/stock_images/medical_professional_6a5e26d8.jpg";

export default function Hero() {
  const handleQAClick = () => {
    window.location.href = "/qa";
  };

  const handleResearchClick = () => {
    window.location.href = "/research";
  };

  return (
    <div className="relative min-h-[80vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-chart-2/20 to-primary/20" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Medical Intelligence
            <br />
            <span className="text-chart-2">You can Trust</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
            Advanced AI-powered medical insights using RAG-based question answering
            and intelligent medicine recommendations. Trained on comprehensive
            medical datasets for accurate, reliable healthcare information.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground border border-primary-border"
              onClick={handleQAClick}
              data-testid="button-try-qa"
            >
              Try Medical Q&A
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20"
              onClick={handleResearchClick}
              data-testid="button-view-research"
            >
              View Research
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-white/30" data-testid="badge-medquad">
              <Brain className="w-3 h-3 mr-1" />
              Trained on MedQuAD Dataset
            </Badge>
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-white/30" data-testid="badge-ai">
              <Pill className="w-3 h-3 mr-1" />
              AI-Powered Insights
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
