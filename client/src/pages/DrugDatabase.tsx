import DrugSearch from "@/components/DrugSearch";
import { Database } from "lucide-react";

export default function DrugDatabase() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Drug Database</h1>
              <p className="text-lg text-muted-foreground">
                Search and filter comprehensive drug information
              </p>
            </div>
          </div>
        </div>

        <DrugSearch />
      </div>
    </div>
  );
}
