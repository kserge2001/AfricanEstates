import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Ruler } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    price,
    bedrooms,
    bathrooms,
    area,
    city,
    neighborhood,
    country,
    mainImage,
    featured,
    createdAt
  } = property;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: false });

  return (
    <Card className="property-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <img 
          src={mainImage} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-0 left-0 m-2">
            <Badge className="bg-primary text-white">Featured</Badge>
          </div>
        )}
        <div className="absolute top-0 right-0 m-2">
          <Button variant="ghost" size="icon" className="bg-white rounded-full shadow hover:text-primary">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{title}</h3>
          <span className="font-bold text-primary">{formattedPrice}</span>
        </div>
        <p className="text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 text-primary mr-1" />
          {neighborhood ? `${neighborhood}, ${city}` : city}, {country}
        </p>
        <div className="flex justify-between mb-2">
          {bedrooms && (
            <span className="flex items-center text-gray-600">
              <Bed className="mr-1 h-4 w-4" /> {bedrooms} Beds
            </span>
          )}
          {bathrooms && (
            <span className="flex items-center text-gray-600">
              <Bath className="mr-1 h-4 w-4" /> {bathrooms} Baths
            </span>
          )}
          {area && (
            <span className="flex items-center text-gray-600">
              <Ruler className="mr-1 h-4 w-4" /> {area} m²
            </span>
          )}
        </div>
        <hr className="my-3" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Listed {timeAgo} ago</span>
          <Link href={`/property/${id}`}>
            <a className="text-secondary hover:text-primary font-medium">View Details</a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
