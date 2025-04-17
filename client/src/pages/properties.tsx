import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Property, PropertySearch } from "@shared/schema";
import { parseJsonSafely } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Filter, ChevronDown, ChevronUp } from "lucide-react";

type SortOption = "price-asc" | "price-desc" | "newest" | "oldest";

export default function Properties() {
  const [location, setLocation] = useLocation();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  
  // Parse query parameters
  const searchParams = new URLSearchParams(location.split("?")[1]);
  
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState<Partial<PropertySearch>>({
    listingType: searchParams.get("listingType") || undefined,
    country: searchParams.get("country") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    bathrooms: searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined,
    minArea: searchParams.get("minArea") ? Number(searchParams.get("minArea")) : undefined,
    maxArea: searchParams.get("maxArea") ? Number(searchParams.get("maxArea")) : undefined,
    features: searchParams.get("features") ? searchParams.get("features")?.split(",") : undefined,
    yearBuilt: searchParams.get("yearBuilt") ? Number(searchParams.get("yearBuilt")) : undefined,
  });

  // Fetch all properties
  const { data: allProperties, isLoading: isLoadingAll } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Search properties mutation
  const searchMutation = useMutation({
    mutationFn: async (criteria: Partial<PropertySearch>) => {
      const res = await apiRequest("POST", "/api/properties/search", criteria);
      return await res.json();
    },
  });

  // Effect to search when criteria changes
  useEffect(() => {
    if (Object.values(searchCriteria).some(value => value !== undefined)) {
      searchMutation.mutate(searchCriteria);
    }
  }, [searchCriteria]);

  // Update URL with search parameters
  const updateSearchParams = (criteria: Partial<PropertySearch>) => {
    const params = new URLSearchParams();
    
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "features" && Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    const newLocation = params.toString() ? `/properties?${params.toString()}` : "/properties";
    setLocation(newLocation);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof PropertySearch, value: any) => {
    const newCriteria = { ...searchCriteria, [key]: value };
    setSearchCriteria(newCriteria);
    updateSearchParams(newCriteria);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchCriteria({});
    setLocation("/properties");
  };

  // Features options
  const featureOptions = [
    "Pool", "Garden", "Garage", "Security", "Furnished", 
    "Air Conditioning", "Gym", "Balcony", "Parking"
  ];

  // Handle feature toggle
  const handleFeatureToggle = (feature: string, checked: boolean) => {
    const currentFeatures = searchCriteria.features || [];
    const newFeatures = checked
      ? [...currentFeatures, feature]
      : currentFeatures.filter(f => f !== feature);
    
    handleFilterChange("features", newFeatures.length > 0 ? newFeatures : undefined);
  };

  // Determine which properties to display
  const displayProperties = searchMutation.data || allProperties || [];

  // Sort properties
  const sortedProperties = [...displayProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Loading state
  const isLoading = isLoadingAll || searchMutation.isPending;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="listing-type">
                <AccordionTrigger>Listing Type</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="listing-sale" 
                        checked={searchCriteria.listingType === "sale"}
                        onCheckedChange={(checked) => 
                          handleFilterChange("listingType", checked ? "sale" : undefined)
                        }
                      />
                      <Label htmlFor="listing-sale">For Sale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="listing-rent" 
                        checked={searchCriteria.listingType === "rent"}
                        onCheckedChange={(checked) => 
                          handleFilterChange("listingType", checked ? "rent" : undefined)
                        }
                      />
                      <Label htmlFor="listing-rent">For Rent</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="property-type">
                <AccordionTrigger>Property Type</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["apartment", "house", "villa", "land", "commercial"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={searchCriteria.propertyType === type}
                          onCheckedChange={(checked) => 
                            handleFilterChange("propertyType", checked ? type : undefined)
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="capitalize">{type}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="location">
                <AccordionTrigger>Location</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={searchCriteria.country || ""} 
                        onValueChange={(value) => 
                          handleFilterChange("country", value ? value : undefined)
                        }
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Any country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any country</SelectItem>
                          <SelectItem value="Nigeria">Nigeria</SelectItem>
                          <SelectItem value="Kenya">Kenya</SelectItem>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                          <SelectItem value="Ghana">Ghana</SelectItem>
                          <SelectItem value="Egypt">Egypt</SelectItem>
                          <SelectItem value="Tanzania">Tanzania</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="min-price">Min Price ($)</Label>
                      <Input 
                        id="min-price" 
                        type="number" 
                        placeholder="Min"
                        value={searchCriteria.minPrice || ""} 
                        onChange={(e) => 
                          handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-price">Max Price ($)</Label>
                      <Input 
                        id="max-price" 
                        type="number" 
                        placeholder="Max"
                        value={searchCriteria.maxPrice || ""} 
                        onChange={(e) => 
                          handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bedrooms">
                <AccordionTrigger>Bedrooms</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`bed-${num}`} 
                          checked={searchCriteria.bedrooms === num}
                          onCheckedChange={(checked) => 
                            handleFilterChange("bedrooms", checked ? num : undefined)
                          }
                        />
                        <Label htmlFor={`bed-${num}`}>{num}+ Bedrooms</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bathrooms">
                <AccordionTrigger>Bathrooms</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`bath-${num}`} 
                          checked={searchCriteria.bathrooms === num}
                          onCheckedChange={(checked) => 
                            handleFilterChange("bathrooms", checked ? num : undefined)
                          }
                        />
                        <Label htmlFor={`bath-${num}`}>{num}+ Bathrooms</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="area">
                <AccordionTrigger>Area</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="min-area">Min Area (m²)</Label>
                      <Input 
                        id="min-area" 
                        type="number" 
                        placeholder="Min"
                        value={searchCriteria.minArea || ""} 
                        onChange={(e) => 
                          handleFilterChange("minArea", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-area">Max Area (m²)</Label>
                      <Input 
                        id="max-area" 
                        type="number" 
                        placeholder="Max"
                        value={searchCriteria.maxArea || ""} 
                        onChange={(e) => 
                          handleFilterChange("maxArea", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features">
                <AccordionTrigger>Features</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {featureOptions.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`feature-${feature}`} 
                          checked={searchCriteria.features?.includes(feature)}
                          onCheckedChange={(checked) => 
                            handleFeatureToggle(feature, !!checked)
                          }
                        />
                        <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <Button 
              onClick={() => setShowMobileFilters(!showMobileFilters)} 
              variant="outline" 
              className="w-full justify-between"
            >
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </div>
              {showMobileFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="m-listing-type">Listing Type</Label>
                    <Select 
                      value={searchCriteria.listingType || ""} 
                      onValueChange={(value) => 
                        handleFilterChange("listingType", value ? value : undefined)
                      }
                    >
                      <SelectTrigger id="m-listing-type">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="m-property-type">Property Type</Label>
                    <Select 
                      value={searchCriteria.propertyType || ""} 
                      onValueChange={(value) => 
                        handleFilterChange("propertyType", value ? value : undefined)
                      }
                    >
                      <SelectTrigger id="m-property-type">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="m-country">Country</Label>
                    <Select 
                      value={searchCriteria.country || ""} 
                      onValueChange={(value) => 
                        handleFilterChange("country", value ? value : undefined)
                      }
                    >
                      <SelectTrigger id="m-country">
                        <SelectValue placeholder="Any country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any country</SelectItem>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        <SelectItem value="Ghana">Ghana</SelectItem>
                        <SelectItem value="Egypt">Egypt</SelectItem>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="m-min-price">Min Price ($)</Label>
                      <Input 
                        id="m-min-price" 
                        type="number" 
                        placeholder="Min"
                        value={searchCriteria.minPrice || ""} 
                        onChange={(e) => 
                          handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="m-max-price">Max Price ($)</Label>
                      <Input 
                        id="m-max-price" 
                        type="number" 
                        placeholder="Max"
                        value={searchCriteria.maxPrice || ""} 
                        onChange={(e) => 
                          handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="m-bedrooms">Bedrooms</Label>
                      <Select 
                        value={searchCriteria.bedrooms?.toString() || ""} 
                        onValueChange={(value) => 
                          handleFilterChange("bedrooms", value ? Number(value) : undefined)
                        }
                      >
                        <SelectTrigger id="m-bedrooms">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="m-bathrooms">Bathrooms</Label>
                      <Select 
                        value={searchCriteria.bathrooms?.toString() || ""} 
                        onValueChange={(value) => 
                          handleFilterChange("bathrooms", value ? Number(value) : undefined)
                        }
                      >
                        <SelectTrigger id="m-bathrooms">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Properties List Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {isLoading ? (
                "Loading properties..."
              ) : (
                `${sortedProperties.length} Properties Found`
              )}
            </h1>
            <div>
              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Applied Filters */}
          {Object.values(searchCriteria).some(value => value !== undefined) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium">Applied Filters:</span>
                
                {searchCriteria.listingType && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full capitalize"
                    onClick={() => handleFilterChange("listingType", undefined)}
                  >
                    For {searchCriteria.listingType} ×
                  </Button>
                )}
                
                {searchCriteria.propertyType && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full capitalize"
                    onClick={() => handleFilterChange("propertyType", undefined)}
                  >
                    {searchCriteria.propertyType} ×
                  </Button>
                )}
                
                {searchCriteria.country && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleFilterChange("country", undefined)}
                  >
                    {searchCriteria.country} ×
                  </Button>
                )}
                
                {(searchCriteria.minPrice || searchCriteria.maxPrice) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => {
                      handleFilterChange("minPrice", undefined);
                      handleFilterChange("maxPrice", undefined);
                    }}
                  >
                    {searchCriteria.minPrice ? `$${searchCriteria.minPrice}` : "$0"} - 
                    {searchCriteria.maxPrice ? `$${searchCriteria.maxPrice}` : "Any"} ×
                  </Button>
                )}
                
                {searchCriteria.bedrooms && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleFilterChange("bedrooms", undefined)}
                  >
                    {searchCriteria.bedrooms}+ Beds ×
                  </Button>
                )}
                
                {searchCriteria.bathrooms && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleFilterChange("bathrooms", undefined)}
                  >
                    {searchCriteria.bathrooms}+ Baths ×
                  </Button>
                )}
                
                {searchCriteria.features && searchCriteria.features.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleFilterChange("features", undefined)}
                  >
                    {searchCriteria.features.length} Features ×
                  </Button>
                )}
                
                {Object.values(searchCriteria).some(value => value !== undefined) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-primary hover:text-primary/80"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Properties Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search filters to find more properties</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
