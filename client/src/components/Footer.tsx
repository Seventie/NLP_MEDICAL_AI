import { Activity, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">
                <span className="text-primary">Medicare</span> AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced medical AI platform providing intelligent healthcare insights through
              RAG-based question answering and medicine recommendations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-about">
                    About
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/qa">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-qa">
                    Medical Q&A
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/recommendations">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-recommendations">
                    Medicine Recommendations
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/research">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-research">
                    Research
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Dataset Acknowledgments</h3>
            <p className="text-sm text-muted-foreground">
              <strong>MedQuAD:</strong> Medical Question Answering Dataset
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Our models are trained on publicly available medical datasets for research
              and educational purposes.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive mb-1">Medical Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  This AI platform provides information for educational and research purposes only.
                  AI-generated medical recommendations should not replace professional medical advice,
                  diagnosis, or treatment. Always consult qualified healthcare professionals for
                  medical decisions.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            © 2025 Medicare AI Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
