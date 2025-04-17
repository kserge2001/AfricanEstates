import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export function FeaturedListings() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: properties, isLoading, isError } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  const filteredProperties = properties?.filter(property => {
    if (activeTab === "all") return true;
    if (activeTab === "sale") return property.listingType === "sale";
    if (activeTab === "rent") return property.listingType === "rent";
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load properties. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl text-secondary">Featured Properties</h2>
            <p className="text-gray-600">Handpicked premium properties across Africa</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sale">For Sale</TabsTrigger>
                <TabsTrigger value="rent">For Rent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredProperties && filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No properties found in this category.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/properties">
            <Button variant="secondary" size="lg">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
