import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Brain, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicalQA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch('/api/medical-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      
      if (data.error) {
        setAnswer(data.answer || 'An error occurred. Please ensure your RAG model is configured.');
        setSources(data.sources || []);
      } else {
        setAnswer(data.answer || 'No answer received from the model.');
        setSources(data.sources || []);
      }
    } catch (error) {
      console.error('Error querying RAG model:', error);
      setAnswer('Failed to connect to the medical Q&A service. Please ensure your RAG model is running.');
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Medical Q&A
          </h1>
          <p className="text-lg text-muted-foreground">
            Ask medical questions and receive AI-powered answers backed by the MedQuAD dataset
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 mb-8 hover-elevate">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Medical Question
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What are the common symptoms of diabetes?"
                  className="min-h-32 resize-none transition-all focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                  data-testid="input-question"
                />
                <motion.p 
                  className="text-sm text-muted-foreground mt-2"
                  animate={{ 
                    color: question.length > 450 ? "rgb(239 68 68)" : "rgb(115 115 115)" 
                  }}
                >
                  {question.length}/500 characters
                </motion.p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="w-full group"
                data-testid="button-submit-question"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Get Answer
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        <AnimatePresence>
          {(answer || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <motion.div 
                    className="p-2 rounded-lg bg-primary/10"
                    animate={{ 
                      scale: isLoading ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: isLoading ? Infinity : 0 
                    }}
                  >
                    <Brain className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">AI Response</h3>
                    {isLoading ? (
                      <div className="space-y-2">
                        <motion.div 
                          className="h-4 bg-muted rounded" 
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div 
                          className="h-4 bg-muted rounded w-5/6"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div 
                          className="h-4 bg-muted rounded w-4/6"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    ) : (
                      <motion.p 
                        className="text-muted-foreground" 
                        data-testid="text-answer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {answer}
                      </motion.p>
                    )}
                  </div>
                </div>

                {sources.length > 0 && (
                  <motion.div 
                    className="pt-4 border-t"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Sources</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((source, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Badge 
                            variant="secondary" 
                            data-testid={`badge-source-${index}`}
                            className="hover:scale-105 transition-transform cursor-pointer"
                          >
                            {source}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Placeholder Note:</strong> This interface is ready
            for your trained RAG model. Connect your model API endpoint to enable real medical
            question answering.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
