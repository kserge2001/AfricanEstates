import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { PropertySearch } from "@shared/schema";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [searchParams, setSearchParams] = useState<Partial<PropertySearch>>({
    listingType: "sale",
    country: "",
    propertyType: ""
  });

  const [advanced, setAdvanced] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: "",
    features: "",
    yearBuilt: ""
  });

  const handleBasicChange = (key: keyof typeof searchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  const handleAdvancedChange = (key: keyof typeof advanced, value: string) => {
    setAdvanced(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // Combine basic and advanced params, converting numbers as needed
    const params: Record<string, string> = { ...searchParams };
    
    if (advanced.minPrice) params.minPrice = advanced.minPrice;
    if (advanced.maxPrice) params.maxPrice = advanced.maxPrice;
    if (advanced.bedrooms) params.bedrooms = advanced.bedrooms;
    if (advanced.bathrooms) params.bathrooms = advanced.bathrooms;
    if (advanced.minArea) params.minArea = advanced.minArea;
    if (advanced.maxArea) params.maxArea = advanced.maxArea;
    if (advanced.features) params.features = advanced.features;
    if (advanced.yearBuilt) params.yearBuilt = advanced.yearBuilt;
    
    // Convert to query string
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== "")
    ).toString();
    
    setLocation(`/properties?${queryString}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-1">
          <Select 
            value={searchParams.listingType} 
            onValueChange={(value) => handleBasicChange("listingType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Buy or Rent" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sale">Buy</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select 
            value={searchParams.country || ""} 
            onValueChange={(value) => handleBasicChange("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any">Select Country</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="Ghana">Ghana</SelectItem>
                <SelectItem value="Tanzania">Tanzania</SelectItem>
                <SelectItem value="Egypt">Egypt</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select 
            value={searchParams.propertyType || ""} 
            onValueChange={(value) => handleBasicChange("propertyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any">Property Type</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="md:w-auto">
          <Button onClick={handleSearch} className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4">
        <Button 
          variant="ghost" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-secondary hover:text-primary flex items-center transition-colors"
        >
          Advanced Search {showAdvanced ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1">Price Range</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Min" 
                  value={advanced.minPrice}
                  onChange={(e) => handleAdvancedChange("minPrice", e.target.value)}
                />
                <span>-</span>
                <Input 
                  type="text" 
                  placeholder="Max" 
                  value={advanced.maxPrice}
                  onChange={(e) => handleAdvancedChange("maxPrice", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1">Bedrooms</Label>
              <Select 
                value={advanced.bedrooms} 
                onValueChange={(value) => handleAdvancedChange("bedrooms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1">Bathrooms</Label>
              <Select 
                value={advanced.bathrooms} 
                onValueChange={(value) => handleAdvancedChange("bathrooms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label className="text-sm font-medium mb-1">Floor Area</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Min m²" 
                  value={advanced.minArea}
                  onChange={(e) => handleAdvancedChange("minArea", e.target.value)}
                />
                <span>-</span>
                <Input 
                  type="text" 
                  placeholder="Max m²" 
                  value={advanced.maxArea}
                  onChange={(e) => handleAdvancedChange("maxArea", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1">Features</Label>
              <Select 
                value={advanced.features} 
                onValueChange={(value) => handleAdvancedChange("features", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Features" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Select Features</SelectItem>
                    <SelectItem value="Pool">Pool</SelectItem>
                    <SelectItem value="Garden">Garden</SelectItem>
                    <SelectItem value="Garage">Garage</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Furnished">Furnished</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1">Year Built</Label>
              <Select 
                value={advanced.yearBuilt} 
                onValueChange={(value) => handleAdvancedChange("yearBuilt", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="2023">Last 1 year</SelectItem>
                    <SelectItem value="2019">Last 5 years</SelectItem>
                    <SelectItem value="2014">Last 10 years</SelectItem>
                    <SelectItem value="2004">Last 20 years</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
