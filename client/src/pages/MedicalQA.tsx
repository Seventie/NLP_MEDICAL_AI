import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Brain, FileText } from "lucide-react";

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
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Medical Q&A</h1>
          <p className="text-lg text-muted-foreground">
            Ask medical questions and receive AI-powered answers backed by the MedQuAD dataset
          </p>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Medical Question
              </label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What are the common symptoms of diabetes?"
                className="min-h-32 resize-none"
                disabled={isLoading}
                data-testid="input-question"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {question.length}/500 characters
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="w-full"
              data-testid="button-submit-question"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 w-4 h-4" />
                  Get Answer
                </>
              )}
            </Button>
          </form>
        </Card>

        {(answer || isLoading) && (
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">AI Response</h3>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
                  </div>
                ) : (
                  <p className="text-muted-foreground" data-testid="text-answer">{answer}</p>
                )}
              </div>
            </div>

            {sources.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Sources</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source, index) => (
                    <Badge key={index} variant="secondary" data-testid={`badge-source-${index}`}>
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Placeholder Note:</strong> This interface is ready
            for your trained RAG model. Connect your model API endpoint to enable real medical
            question answering.
          </p>
        </div>
      </div>
    </div>
  );
}
