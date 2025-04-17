import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  isAgent: z.boolean().default(false),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      phone: "",
      isAgent: false,
    },
  });

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Auth Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Welcome to AfriHome</CardTitle>
                <CardDescription className="text-center">
                  Log in or create an account to access Africa's premier real estate marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <a href="#" className="text-xs text-primary hover:underline">
                                  Forgot Password?
                                </a>
                              </div>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/80"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
                          ) : (
                            "Log In"
                          )}
                        </Button>
                      </form>
                    </Form>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button 
                          type="button"
                          onClick={() => setActiveTab("register")}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="isAgent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Register as a Real Estate Agent</FormLabel>
                                <p className="text-sm text-gray-500">
                                  Check this box if you are a real estate professional
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/80"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </form>
                    </Form>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button 
                          type="button"
                          onClick={() => setActiveTab("login")}
                          className="text-primary hover:underline font-medium"
                        >
                          Log In
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Hero Section */}
          <div className="hidden md:block relative rounded-lg overflow-hidden shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-transparent opacity-90"></div>
            </div>
            <div className="relative z-10 flex flex-col justify-center h-full p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Find Your Dream Home in Africa</h2>
              <p className="mb-6">
                Join thousands of satisfied customers who have found their perfect property through AfriHome
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary rounded-full p-1 mr-3">✓</span>
                  <span>Thousands of properties across Africa</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary rounded-full p-1 mr-3">✓</span>
                  <span>Secure and verified listings</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary rounded-full p-1 mr-3">✓</span>
                  <span>Direct contact with property owners and agents</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary rounded-full p-1 mr-3">✓</span>
                  <span>List your property for free</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
