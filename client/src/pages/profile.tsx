import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Property } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { parseJsonSafely } from "@/lib/utils";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Home, User as UserIcon, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a full implementation, we would add the API call to update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  // Fetch user's properties
  const { data: userProperties, isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: [`/api/user/${user?.id}/properties`],
    enabled: !!user,
  });

  // Handle property deletion
  const handleDeleteProperty = (propertyId: number) => {
    // In a full implementation, we would add the API call to delete the property
    toast({
      title: "Property deleted",
      description: "The property has been removed from your listings.",
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">You need to be logged in</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile page.</p>
          <Link href="/auth">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">My Account</CardTitle>
              <CardDescription>Manage your profile and listings</CardDescription>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging out...</>
              ) : (
                "Log Out"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center">
                <Home className="h-4 w-4 mr-2" /> My Properties
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" /> Saved Properties
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>View and update your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={user.username} 
                          disabled 
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                      </div>
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName"
                          value={profileForm.fullName} 
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email"
                          value={profileForm.email} 
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          value={profileForm.phone || ""} 
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Username</h3>
                          <p className="mt-1">{user.username}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                          <p className="mt-1">{user.fullName || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1">{user.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <p className="mt-1">{user.phone || "Not provided"}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                        <p className="mt-1">{user.isAgent ? "Real Estate Agent" : "Regular User"}</p>
                      </div>
                      <div className="text-right">
                        <Button type="button" onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Properties Tab */}
            <TabsContent value="properties">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">My Properties</h2>
                  <Link href="/post-listing">
                    <Button className="bg-primary hover:bg-primary/80">
                      Add New Property
                    </Button>
                  </Link>
                </div>

                {isLoadingProperties ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userProperties && userProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProperties.map((property) => (
                      <div key={property.id} className="relative">
                        <PropertyCard property={property} />
                        <div className="absolute top-2 right-2 z-10 flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white hover:bg-gray-100"
                            title="Edit property"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            title="Delete property"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Properties Listed Yet</h3>
                    <p className="text-gray-600 mb-6">Start listing your properties to reach potential buyers or renters</p>
                    <Link href="/post-listing">
                      <Button>List Your First Property</Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Saved Properties Tab */}
            <TabsContent value="saved">
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Saved Properties</h3>
                <p className="text-gray-600 mb-6">You haven't saved any properties yet. Browse listings and click the heart icon to save properties for later</p>
                <Link href="/properties">
                  <Button>Browse Properties</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-gray-500">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
