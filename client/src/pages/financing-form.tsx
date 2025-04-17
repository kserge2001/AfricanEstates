import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { financingRequestSchema } from "@shared/schema";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, Check } from "lucide-react";

// Extend the schema for form specifics
const formSchema = financingRequestSchema.extend({
  confirmDetails: z.boolean().refine(val => val === true, {
    message: "You must confirm that all details are correct",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface Country {
  name: string;
  code: string;
}

interface Currency {
  code: string;
  name: string;
}

export default function FinancingForm() {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch countries
  const { data: countries } = useQuery<string[]>({
    queryKey: ["/api/countries"],
    select: (data) => 
      data.map((country): Country => ({
        name: country,
        code: country.substring(0, 2).toUpperCase(),
      })),
  });

  // Fetch currencies
  const { data: currencies } = useQuery<Currency[]>({
    queryKey: ["/api/currencies"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      city: "",
      country: "",
      salary: 0,
      jobTitle: "",
      loanAmount: 0,
      monthlyPayment: 0,
      preferredCurrency: "USD",
      phoneNumber: "",
      additionalComments: "",
      confirmDetails: false,
    },
  });

  // Handle country change to update the flag
  const onCountryChange = (value: string) => {
    form.setValue("country", value);
    setSelectedCountry(value);
  };

  // Submit financing request
  const financingMutation = useMutation({
    mutationFn: async (data: Omit<FormValues, "confirmDetails">) => {
      const res = await apiRequest("POST", "/api/financing", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Financing Request Submitted",
        description: "Your financing request has been submitted successfully. Our team will contact you shortly.",
        variant: "default",
      });
      setIsSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit financing request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    // Remove confirmDetails as it's not part of the API schema
    const { confirmDetails, ...apiData } = data;
    
    // Convert string inputs to numbers
    const financingData = {
      ...apiData,
      salary: Number(apiData.salary),
      loanAmount: Number(apiData.loanAmount),
      monthlyPayment: Number(apiData.monthlyPayment),
    };
    
    financingMutation.mutate(financingData);
  };

  // Get the flag URL for the selected country
  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
            <CardDescription className="text-lg">
              Your financing request has been submitted successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              Our financial advisors will review your application and contact you shortly.
              Meanwhile, you can continue browsing properties on our platform.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <CreditCard className="mr-2 h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Property Financing Request</CardTitle>
            </div>
            <CardDescription>
              Complete this form to apply for property financing. Our team will review your information
              and contact you with personalized options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
                    
                    <FormField
                      control={form.control}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+123 456 7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              onValueChange={onCountryChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries?.map((country) => (
                                  <SelectItem key={country.name} value={country.name}>
                                    <div className="flex items-center">
                                      <img 
                                        src={getFlagUrl(country.code)} 
                                        alt={country.name} 
                                        className="w-5 h-4 mr-2 inline-block"
                                      />
                                      {country.name}
                                    </div>
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
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Financial Information Section */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-medium border-b pb-2">Financial Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your job title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salary"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Annual Salary (USD)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g. 40000" 
                                onChange={(e) => onChange(e.target.valueAsNumber)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="loanAmount"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Desired Loan Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g. 250000" 
                                onChange={(e) => onChange(e.target.valueAsNumber)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="monthlyPayment"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Max Monthly Payment</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g. 1500" 
                                onChange={(e) => onChange(e.target.valueAsNumber)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="preferredCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencies?.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the currency you'd prefer for your loan and payments
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Comments (optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional information you'd like to share with our financing team" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmDetails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 mt-1"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I confirm that all the information provided is accurate and true
                            </FormLabel>
                            <FormDescription>
                              By submitting this form, you agree to be contacted by our financing team
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <CardFooter className="flex justify-end px-0 pt-4">
                  <Button type="submit" disabled={financingMutation.isPending}>
                    {financingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Submit Financing Request"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}