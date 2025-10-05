import { Card } from "@/components/ui/card";
import { Database, Brain, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    <section className="py-20 bg-muted/30" id="about" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <motion.div 
            className="md:col-span-3"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>

          <motion.div 
            className="md:col-span-2 space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-6 hover-elevate cursor-pointer group" data-testid={`card-stat-${index}`}>
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="p-3 rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <stat.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold group-hover:text-primary transition-colors">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
