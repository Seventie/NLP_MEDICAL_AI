import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Pill, Sparkles } from "lucide-react";
import heroImage from "@assets/stock_images/medical_professional_6a5e26d8.jpg";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "You can Trust";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleQAClick = () => {
    window.location.href = "/qa";
  };

  const handleResearchClick = () => {
    window.location.href = "/research";
  };

  return (
    <div className="relative min-h-[80vh] flex items-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-chart-2/20 to-primary/20" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl">
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Medical Intelligence
            <br />
            <span className="text-chart-2 inline-flex items-center gap-2">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Advanced AI-powered medical insights using RAG-based question answering
            and intelligent medicine recommendations. Trained on comprehensive
            medical datasets for accurate, reliable healthcare information.
          </motion.p>

          <motion.div 
            className="flex flex-wrap gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground border border-primary-border group"
              onClick={handleQAClick}
              data-testid="button-try-qa"
            >
              Try Medical Q&A
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 group"
              onClick={handleResearchClick}
              data-testid="button-view-research"
            >
              View Research
              <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:scale-105 transition-transform cursor-pointer" data-testid="badge-medquad">
              <Brain className="w-3 h-3 mr-1" />
              Trained on MedQuAD Dataset
            </Badge>
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:scale-105 transition-transform cursor-pointer" data-testid="badge-ai">
              <Pill className="w-3 h-3 mr-1" />
              AI-Powered Insights
            </Badge>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
