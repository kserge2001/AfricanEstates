import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema, InsertProperty } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { parseJsonSafely } from "@/lib/utils";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload } from "lucide-react";

// Extended schema with client-side validations
const extendedPropertySchema = insertPropertySchema.extend({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  area: z.number().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  propertyType: z.string().min(1, "Property type is required"),
  listingType: z.string().min(1, "Listing type is required"),
  mainImage: z.string().min(1, "Main image URL is required"),
  selectedFeatures: z.array(z.string()).optional(),
  additionalImages: z.array(z.string()).optional(),
});

type ExtendedFormValues = z.infer<typeof extendedPropertySchema>;

const features = [
  "Pool", "Garden", "Garage", "Security", "Furnished", 
  "Air Conditioning", "Gym", "Balcony", "Parking",
  "Ocean View", "Mountain View", "City View", "Fireplace",
  "Basement", "Elevator", "Doorman", "Wheelchair Access"
];

const countries = [
  "Nigeria", "Kenya", "South Africa", "Ghana", "Egypt", 
  "Tanzania", "Morocco", "Algeria", "Ethiopia", "Uganda",
  "Rwanda", "Senegal", "Ivory Coast", "Cameroon", "Namibia"
];

export default function PostListing() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<ExtendedFormValues>({
    resolver: zodResolver(extendedPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      bedrooms: undefined,
      bathrooms: undefined,
      area: undefined,
      country: "",
      city: "",
      neighborhood: "",
      address: "",
      propertyType: "",
      listingType: "sale",
      yearBuilt: undefined,
      mainImage: "",
      selectedFeatures: [],
      additionalImages: [],
    },
  });
  
  const createPropertyMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const res = await apiRequest("POST", "/api/properties", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Property listed successfully!",
        description: "Your property has been added to our listings.",
      });
      navigate("/properties");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to list property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExtendedFormValues) => {
    // Prepare the data for submission
    const propertyData: InsertProperty = {
      ...data,
      features: data.selectedFeatures && data.selectedFeatures.length > 0 
        ? JSON.stringify(data.selectedFeatures) 
        : undefined,
      images: data.additionalImages && data.additionalImages.length > 0 
        ? JSON.stringify(data.additionalImages) 
        : undefined,
    };

    // Remove the fields that are not in InsertProperty type
    delete (propertyData as any).selectedFeatures;
    delete (propertyData as any).additionalImages;

    createPropertyMutation.mutate(propertyData);
  };

  const goToNextTab = () => {
    if (activeTab === "details") {
      const fields = ["title", "description", "price", "country", "city", "propertyType", "listingType"];
      const isValid = fields.every(field => {
        return form.trigger(field as keyof ExtendedFormValues);
      });
      
      if (isValid) {
        setActiveTab("media");
      }
    } else if (activeTab === "media") {
      const mainImageValid = form.trigger("mainImage");
      if (mainImageValid) {
        setActiveTab("features");
      }
    }
  };

  const goToPrevTab = () => {
    if (activeTab === "media") {
      setActiveTab("details");
    } else if (activeTab === "features") {
      setActiveTab("media");
    }
  };

  // Add image URL to the form
  const addImageUrl = () => {
    const imageUrl = form.watch("mainImage");
    if (!imageUrl) return;
    
    const additionalImages = form.watch("additionalImages") || [];
    if (!additionalImages.includes(imageUrl)) {
      form.setValue("additionalImages", [...additionalImages, imageUrl]);
      form.setValue("mainImage", "");
    }
  };

  // Remove image from additional images
  const removeImage = (index: number) => {
    const additionalImages = form.watch("additionalImages") || [];
    additionalImages.splice(index, 1);
    form.setValue("additionalImages", [...additionalImages]);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Post a New Property Listing</CardTitle>
          <CardDescription>
            Fill out the form below to list your property on AfriHome
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step indicators */}
              <div className="flex mb-8">
                <div className="flex-1 text-center">
                  <div className={`w-8 h-8 ${activeTab === "details" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"} rounded-full flex items-center justify-center mx-auto`}>1</div>
                  <p className={`text-sm mt-1 ${activeTab === "details" ? "text-primary font-medium" : "text-gray-600"}`}>Property Details</p>
                </div>
                <div className="flex-1 text-center">
                  <div className={`w-8 h-8 ${activeTab === "media" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"} rounded-full flex items-center justify-center mx-auto`}>2</div>
                  <p className={`text-sm mt-1 ${activeTab === "media" ? "text-primary font-medium" : "text-gray-600"}`}>Media & Location</p>
                </div>
                <div className="flex-1 text-center">
                  <div className={`w-8 h-8 ${activeTab === "features" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"} rounded-full flex items-center justify-center mx-auto`}>3</div>
                  <p className={`text-sm mt-1 ${activeTab === "features" ? "text-primary font-medium" : "text-gray-600"}`}>Features & Submit</p>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Property Details Tab */}
                <TabsContent value="details" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="listingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select listing type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sale">For Sale</SelectItem>
                              <SelectItem value="rent">For Rent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Modern 3 Bedroom Apartment" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive title gets more interest
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your property in detail..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include key features, nearby amenities, and anything unique about the property
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 450000" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 3" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 2" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area (m²)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 120" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearBuilt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Built</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 2020" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button type="button" onClick={goToNextTab}>
                      Next: Media & Location
                    </Button>
                  </div>
                </TabsContent>

                {/* Media & Location Tab */}
                <TabsContent value="media" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Lagos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neighborhood (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Lekki" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the complete property address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Property Images</h3>
                    <FormField
                      control={form.control}
                      name="mainImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Image URL</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                placeholder="Enter image URL" 
                                {...field} 
                              />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon" 
                              onClick={addImageUrl}
                              title="Add to gallery"
                              disabled={!field.value}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormDescription>
                            This will be the primary image shown for your listing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Preview of additional images */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Additional Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {form.watch("additionalImages")?.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Property image ${index + 1}`} 
                              className="h-24 w-full object-cover rounded-md border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+Image";
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button type="button" variant="outline" onClick={goToPrevTab}>
                      Back
                    </Button>
                    <Button type="button" onClick={goToNextTab}>
                      Next: Features & Submit
                    </Button>
                  </div>
                </TabsContent>

                {/* Features & Submit Tab */}
                <TabsContent value="features" className="space-y-4 mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Property Features</h3>
                    <p className="text-sm text-gray-500 mb-4">Select all the features that apply to your property</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name="selectedFeatures"
                        render={() => (
                          <FormItem>
                            {features.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2 mb-2">
                                <FormControl>
                                  <Checkbox
                                    checked={form.watch("selectedFeatures")?.includes(feature)}
                                    onCheckedChange={(checked) => {
                                      const currentFeatures = form.watch("selectedFeatures") || [];
                                      const updatedFeatures = checked
                                        ? [...currentFeatures, feature]
                                        : currentFeatures.filter((f) => f !== feature);
                                      form.setValue("selectedFeatures", updatedFeatures);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">
                                  {feature}
                                </FormLabel>
                              </div>
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button type="button" variant="outline" onClick={goToPrevTab}>
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/80"
                      disabled={createPropertyMutation.isPending}
                    >
                      {createPropertyMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                      ) : (
                        "Submit Listing"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-gray-500">
            By posting a listing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
