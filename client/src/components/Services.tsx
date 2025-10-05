import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pill, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
    <section className="py-20" id="services" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our AI Services</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience cutting-edge medical AI technology with our two flagship services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Card
                className={`relative overflow-hidden border-2 ${service.borderColor} hover-elevate transition-all duration-300 ${hoveredIndex === index ? 'shadow-2xl' : ''}`}
                data-testid={service.testId}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: hoveredIndex === index ? 0.7 : 0.5 }}
                  transition={{ duration: 0.3 }}
                />
                <CardHeader className="relative">
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                    animate={{ 
                      scale: hoveredIndex === index ? 1.1 : 1,
                      rotate: hoveredIndex === index ? 5 : 0 
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <service.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button
                    onClick={() => window.location.href = service.href}
                    data-testid={`button-try-${service.testId}`}
                    className="group"
                  >
                    Try Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
