import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Pill, AlertCircle, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DrugResult {
  id: string;
  genericName: string;
  drugClasses?: string;
  brandNames?: string;
  activity?: string;
  rxOtc?: string;
  pregnancyCategory?: string;
  csa?: string;
  alcohol?: string;
  rating?: string;
  description?: string;
}

export default function DrugSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rxOtcFilter, setRxOtcFilter] = useState("all");
  const [pregnancyCategoryFilter, setPregnancyCategoryFilter] = useState("all");
  const [csaFilter, setCsaFilter] = useState("all");
  const [alcoholFilter, setAlcoholFilter] = useState("all");
  const [drugClassFilter, setDrugClassFilter] = useState("");
  const [results, setResults] = useState<DrugResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // TODO: Replace with actual API call to your drug dataset
  const mockResults: DrugResult[] = [
    {
      id: "1",
      genericName: "Acetaminophen",
      drugClasses: "Analgesics, Antipyretics",
      brandNames: "Tylenol, Paracetamol",
      activity: "Very High",
      rxOtc: "OTC",
      pregnancyCategory: "B",
      csa: "N",
      alcohol: "X",
      rating: "7.5",
      description: "Pain reliever and fever reducer"
    },
    {
      id: "2",
      genericName: "Ibuprofen",
      drugClasses: "NSAIDs",
      brandNames: "Advil, Motrin",
      activity: "Very High",
      rxOtc: "OTC",
      pregnancyCategory: "C",
      csa: "N",
      alcohol: "X",
      rating: "8.2",
      description: "Nonsteroidal anti-inflammatory drug"
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (rxOtcFilter !== 'all') params.append('rxOtc', rxOtcFilter);
      if (pregnancyCategoryFilter !== 'all') params.append('pregnancyCategory', pregnancyCategoryFilter);
      if (csaFilter !== 'all') params.append('csa', csaFilter);
      if (alcoholFilter !== 'all') params.append('alcohol', alcoholFilter);
      if (drugClassFilter) params.append('drugClass', drugClassFilter);

      const response = await fetch(`/api/drugs/search?${params.toString()}`);
      const data = await response.json();
      
      // For now, show mock results until drug database is connected
      // Replace with: setResults(data.results || []);
      setResults(mockResults);
    } catch (error) {
      console.error('Drug search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setRxOtcFilter("all");
    setPregnancyCategoryFilter("all");
    setCsaFilter("all");
    setAlcoholFilter("all");
    setDrugClassFilter("");
  };

  const getPregnancyCategoryBadge = (category?: string) => {
    if (!category) return null;
    const colors: Record<string, string> = {
      A: "bg-chart-3/20 text-chart-3",
      B: "bg-chart-3/20 text-chart-3",
      C: "bg-chart-4/20 text-chart-4",
      D: "bg-destructive/20 text-destructive",
      X: "bg-destructive/20 text-destructive",
      N: "bg-muted text-muted-foreground"
    };
    return (
      <Badge variant="secondary" className={colors[category] || ""}>
        Pregnancy: {category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by drug name, brand name, or drug class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
            data-testid="input-drug-search"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" data-testid="button-filters">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Drug Filters</SheetTitle>
              <SheetDescription>
                Filter drugs by various attributes
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-180px)] mt-6">
              <div className="space-y-6 pr-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Drug Class</label>
                  <Input
                    placeholder="e.g., NSAIDs, Antibiotics"
                    value={drugClassFilter}
                    onChange={(e) => setDrugClassFilter(e.target.value)}
                    data-testid="input-drug-class"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rx/OTC Status</label>
                  <Select value={rxOtcFilter} onValueChange={setRxOtcFilter}>
                    <SelectTrigger data-testid="select-rx-otc">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="OTC">OTC (Over-the-counter)</SelectItem>
                      <SelectItem value="Rx">Rx (Prescription)</SelectItem>
                      <SelectItem value="Rx/OTC">Rx/OTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pregnancy Category</label>
                  <Select value={pregnancyCategoryFilter} onValueChange={setPregnancyCategoryFilter}>
                    <SelectTrigger data-testid="select-pregnancy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="A">A - No risk shown</SelectItem>
                      <SelectItem value="B">B - Animal studies safe</SelectItem>
                      <SelectItem value="C">C - Risk cannot be ruled out</SelectItem>
                      <SelectItem value="D">D - Positive evidence of risk</SelectItem>
                      <SelectItem value="X">X - Contraindicated</SelectItem>
                      <SelectItem value="N">N - Not classified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">CSA Schedule</label>
                  <Select value={csaFilter} onValueChange={setCsaFilter}>
                    <SelectTrigger data-testid="select-csa">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="N">N - Not controlled</SelectItem>
                      <SelectItem value="1">Schedule 1</SelectItem>
                      <SelectItem value="2">Schedule 2</SelectItem>
                      <SelectItem value="3">Schedule 3</SelectItem>
                      <SelectItem value="4">Schedule 4</SelectItem>
                      <SelectItem value="5">Schedule 5</SelectItem>
                      <SelectItem value="M">M - Multiple schedules</SelectItem>
                      <SelectItem value="U">U - Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Alcohol Interaction</label>
                  <Select value={alcoholFilter} onValueChange={setAlcoholFilter}>
                    <SelectTrigger data-testid="select-alcohol">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="X">X - Interacts with Alcohol</SelectItem>
                      <SelectItem value="none">No Interaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                  data-testid="button-clear-filters"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Button onClick={handleSearch} data-testid="button-search">
          Search
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} result(s)
          </p>
          {results.map((drug) => (
            <Card key={drug.id} className="hover-elevate" data-testid={`card-drug-${drug.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">{drug.genericName}</CardTitle>
                    </div>
                    {drug.brandNames && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Brand Names:</strong> {drug.brandNames}
                      </p>
                    )}
                    {drug.description && (
                      <p className="text-sm text-muted-foreground">{drug.description}</p>
                    )}
                  </div>
                  {drug.rating && (
                    <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-semibold">{drug.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {drug.drugClasses && (
                      <Badge variant="outline" data-testid={`badge-class-${drug.id}`}>
                        {drug.drugClasses}
                      </Badge>
                    )}
                    {drug.rxOtc && (
                      <Badge
                        variant="secondary"
                        className={
                          drug.rxOtc === "Rx"
                            ? "bg-primary/20 text-primary"
                            : "bg-chart-2/20 text-chart-2"
                        }
                      >
                        {drug.rxOtc}
                      </Badge>
                    )}
                    {getPregnancyCategoryBadge(drug.pregnancyCategory)}
                    {drug.alcohol === "X" && (
                      <Badge variant="secondary" className="bg-destructive/20 text-destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Alcohol Interaction
                      </Badge>
                    )}
                    {drug.csa && drug.csa !== "N" && (
                      <Badge variant="secondary">CSA Schedule: {drug.csa}</Badge>
                    )}
                  </div>
                  {drug.activity && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Activity:</strong> {drug.activity}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Data Integration Note:</strong> This search interface
          is ready for your local drug dataset. Connect your dataset API endpoint to enable real-time
          drug searching and filtering across all columns.
        </p>
      </div>
    </div>
  );
}
