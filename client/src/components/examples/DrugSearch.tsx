import DrugSearch from "../DrugSearch";
import { ThemeProvider } from "../ThemeProvider";

export default function DrugSearchExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <DrugSearch />
      </div>
    </ThemeProvider>
  );
}
