import { LocationCard } from "@/components/ui/location-card";
import { Link } from "wouter";

// Define the popular locations data
const popularLocations = [
  {
    name: "Lagos, Nigeria",
    image: "https://images.unsplash.com/photo-1580746738099-95e8b4847a35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    propertyCount: 248,
    url: "/properties?country=Nigeria&city=Lagos"
  },
  {
    name: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1611348586840-ea9872d33411?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    propertyCount: 187,
    url: "/properties?country=Kenya&city=Nairobi"
  },
  {
    name: "Cape Town, South Africa",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    propertyCount: 312,
    url: "/properties?country=South Africa&city=Cape Town"
  },
  {
    name: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1562176566-e9afd27531d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    propertyCount: 165,
    url: "/properties?country=Egypt&city=Cairo"
  }
];

export function PopularLocations() {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="font-bold text-2xl md:text-3xl text-secondary text-center mb-3">
          Popular Locations
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Discover properties in Africa's most sought-after locations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularLocations.map((location, index) => (
            <Link key={index} href={location.url}>
                <LocationCard
                  image={location.image}
                  name={location.name}
                  propertyCount={location.propertyCount}
                />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
