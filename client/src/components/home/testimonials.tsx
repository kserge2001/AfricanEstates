import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the testimonials data
const testimonials = [
  {
    rating: 5,
    text: "AfriHome made it so easy to find my dream home in Lagos. The search tools are intuitive and the property descriptions were accurate. I found exactly what I was looking for!",
    author: {
      name: "Oluwaseun Adeyemi",
      location: "Lagos, Nigeria",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  },
  {
    rating: 5,
    text: "I listed my property on AfriHome and got multiple serious inquiries within days. The process was smooth and the team was very supportive throughout. Highly recommended!",
    author: {
      name: "Michelle Okafor",
      location: "Nairobi, Kenya",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  },
  {
    rating: 4.5,
    text: "As a foreign investor, I was looking for properties in Cape Town. AfriHome provided detailed information that helped me make informed decisions without even visiting in person.",
    author: {
      name: "Richard Thompson",
      location: "Cape Town, South Africa",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  }
];

export function Testimonials() {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="font-bold text-2xl md:text-3xl text-secondary text-center mb-3">
          Client Testimonials
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          What our satisfied clients have to say about their experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-500 flex">
                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                      <Star key={i} className="fill-current" />
                    ))}
                    {testimonial.rating % 1 !== 0 && (
                      <StarHalf className="fill-current" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
                    <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.author.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.author.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
