import { ThemeProvider } from "../ThemeProvider";

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background text-foreground">
        <h2 className="text-2xl font-bold mb-4">Theme Provider Example</h2>
        <p className="text-muted-foreground">Theme provider is working and ready to use throughout the app.</p>
      </div>
    </ThemeProvider>
  );
}
