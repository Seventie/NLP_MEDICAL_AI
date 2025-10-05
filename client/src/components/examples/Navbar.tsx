import Navbar from "../Navbar";
import { ThemeProvider } from "../ThemeProvider";
import { Router } from "wouter";

export default function NavbarExample() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <div className="p-8">
          <p className="text-muted-foreground">Navbar is displayed above</p>
        </div>
      </Router>
    </ThemeProvider>
  );
}
