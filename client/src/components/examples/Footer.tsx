import Footer from "../Footer";
import { ThemeProvider } from "../ThemeProvider";
import { Router } from "wouter";

export default function FooterExample() {
  return (
    <ThemeProvider>
      <Router>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}
