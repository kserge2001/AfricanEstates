import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, MapPin, Bed, Bath, Ruler, Calendar, Heart, Share, Phone, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:id");
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const propertyId = params?.id;

  const { data: property, isLoading, isError } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const [contactForm, setContactForm] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "The property owner has been notified of your interest.",
    });
    // In a real app, we would send this to the backend
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the property you're looking for.</p>
          <Button>Go Back to Properties</Button>
        </div>
      </div>
    );
  }

  const { 
    title, 
    description, 
    price, 
    bedrooms, 
    bathrooms, 
    area,
    country, 
    city, 
    neighborhood,
    address,
    propertyType,
    listingType,
    yearBuilt,
    features,
    mainImage,
    images,
    createdAt
  } = property;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: false });
  const parsedImages = images ? JSON.parse(images) : [mainImage];
  const parsedFeatures = features ? JSON.parse(features) : [];

  // Set active image to main image if it's not already in the list
  const allImages = parsedImages.includes(mainImage) 
    ? parsedImages 
    : [mainImage, ...parsedImages];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Property Images */}
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden mb-2 bg-gray-100">
              <img 
                src={allImages[activeImageIndex]} 
                alt={title} 
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img: string, idx: number) => (
                <div 
                  key={idx}
                  className={`cursor-pointer rounded-md overflow-hidden w-20 h-20 flex-shrink-0 ${
                    idx === activeImageIndex ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`${title} - view ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Property Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={`${listingType === 'sale' ? 'bg-primary' : 'bg-accent2'} mb-2`}>
                  For {listingType === 'sale' ? 'Sale' : 'Rent'}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-primary mr-1" />
                  {address || (neighborhood ? `${neighborhood}, ${city}` : `${city}, ${country}`)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{formattedPrice}</p>
                {listingType === 'rent' && <p className="text-gray-500 text-sm">per month</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-6 mt-4">
              {bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-lg font-medium">{bedrooms}</p>
                    <p className="text-gray-500 text-sm">Bedrooms</p>
                  </div>
                </div>
              )}
              {bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-lg font-medium">{bathrooms}</p>
                    <p className="text-gray-500 text-sm">Bathrooms</p>
                  </div>
                </div>
              )}
              {area && (
                <div className="flex items-center">
                  <Ruler className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-lg font-medium">{area} m²</p>
                    <p className="text-gray-500 text-sm">Area</p>
                  </div>
                </div>
              )}
              {yearBuilt && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-lg font-medium">{yearBuilt}</p>
                    <p className="text-gray-500 text-sm">Year Built</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Property Details Tabs */}
          <Tabs defaultValue="description">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none text-gray-700">
                <p>{description}</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Property Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-500">Property Type:</span>
                    <p className="font-medium capitalize">{propertyType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Listing Type:</span>
                    <p className="font-medium capitalize">For {listingType}</p>
                  </div>
                  {bedrooms && (
                    <div>
                      <span className="text-gray-500">Bedrooms:</span>
                      <p className="font-medium">{bedrooms}</p>
                    </div>
                  )}
                  {bathrooms && (
                    <div>
                      <span className="text-gray-500">Bathrooms:</span>
                      <p className="font-medium">{bathrooms}</p>
                    </div>
                  )}
                  {area && (
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <p className="font-medium">{area} m²</p>
                    </div>
                  )}
                  {yearBuilt && (
                    <div>
                      <span className="text-gray-500">Year Built:</span>
                      <p className="font-medium">{yearBuilt}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              {parsedFeatures.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {parsedFeatures.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center">
                        <span className="bg-primary bg-opacity-10 text-primary p-1 rounded-full mr-2">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No features listed for this property.</p>
              )}
            </TabsContent>
            <TabsContent value="location" className="mt-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Property Location</h3>
                <p className="mb-4">
                  <MapPin className="h-5 w-5 text-primary inline mr-2" />
                  {address || `${neighborhood ? `${neighborhood}, ` : ''}${city}, ${country}`}
                </p>
                <div className="rounded-lg bg-gray-200 h-72 flex items-center justify-center">
                  <p className="text-gray-600">Map view would appear here in a full implementation</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">About the area</h4>
                  <p className="text-gray-600">
                    {neighborhood ? `${neighborhood} is a great area in ${city}, ${country}.` : 
                    `${city} is a great city in ${country}.`} This location offers excellent amenities and access to local attractions.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="Your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      placeholder="I'm interested in this property..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/80">
                    Send Message
                  </Button>
                </div>
              </form>
              <Separator className="my-4" />
              <div className="flex flex-col space-y-2">
                <a href="tel:+1234567890" className="flex items-center text-gray-700 hover:text-primary">
                  <Phone className="h-4 w-4 mr-2" /> +123 456 7890
                </a>
                <a href="mailto:agent@afrihome.com" className="flex items-center text-gray-700 hover:text-primary">
                  <Mail className="h-4 w-4 mr-2" /> agent@afrihome.com
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Property Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 flex justify-between mb-4">
                <span>Listed {timeAgo} ago</span>
                <span>ID: #{property.id}</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mb-2">Schedule Viewing</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule a Viewing</DialogTitle>
                    <DialogDescription>
                      Complete the form below to request a viewing for this property.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="viewing-date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="viewing-date"
                        type="date"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="viewing-time" className="text-right">
                        Time
                      </Label>
                      <Input
                        id="viewing-time"
                        type="time"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="viewing-notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="viewing-notes"
                        placeholder="Any special requests or questions?"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => {
                      toast({
                        title: "Viewing requested",
                        description: "The agent will contact you to confirm the viewing.",
                      });
                    }}
                  >
                    Request Viewing
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
