import { type User, type InsertUser, type Property, type InsertProperty, PropertySearch, FinancingRequest } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getAllProperties(): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty & { userId: number }): Promise<Property>;
  getUserProperties(userId: number): Promise<Property[]>;
  searchProperties(criteria: PropertySearch): Promise<Property[]>;
  
  // Financing operations
  submitFinancingRequest(request: FinancingRequest): Promise<{ id: number; success: boolean }>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private financingRequests: Map<number, FinancingRequest & { id: number; timestamp: string }>;
  public sessionStore: session.SessionStore;
  private userId: number = 1;
  private propertyId: number = 1;
  private financingRequestId: number = 1;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.financingRequests = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Seed some initial properties
    this.seedProperties();
  }
  
  async submitFinancingRequest(request: FinancingRequest): Promise<{ id: number; success: boolean }> {
    const id = this.financingRequestId++;
    const timestamp = new Date().toISOString();
    
    this.financingRequests.set(id, {
      ...request,
      id,
      timestamp
    });
    
    return { id, success: true };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date().toISOString() };
    this.users.set(id, user);
    return user;
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => property.featured);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(
    property: InsertProperty & { userId: number }
  ): Promise<Property> {
    const id = this.propertyId++;
    const newProperty: Property = {
      ...property,
      id,
      featured: false,
      createdAt: new Date().toISOString(),
      status: "active"
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async getUserProperties(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId
    );
  }

  async searchProperties(criteria: PropertySearch): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => {
      if (criteria.listingType && property.listingType !== criteria.listingType) return false;
      if (criteria.country && property.country !== criteria.country) return false;
      if (criteria.propertyType && property.propertyType !== criteria.propertyType) return false;
      if (criteria.minPrice && property.price < criteria.minPrice) return false;
      if (criteria.maxPrice && property.price > criteria.maxPrice) return false;
      if (criteria.bedrooms && property.bedrooms < criteria.bedrooms) return false;
      if (criteria.bathrooms && property.bathrooms < criteria.bathrooms) return false;
      if (criteria.minArea && property.area < criteria.minArea) return false;
      if (criteria.maxArea && property.area > criteria.maxArea) return false;
      
      if (criteria.features && criteria.features.length > 0) {
        const propertyFeatures = property.features ? JSON.parse(property.features) : [];
        if (!criteria.features.every(feature => propertyFeatures.includes(feature))) {
          return false;
        }
      }
      
      if (criteria.yearBuilt && property.yearBuilt < criteria.yearBuilt) return false;
      
      return true;
    });
  }

  private seedProperties() {
    // Create a sample user for the properties
    const sampleUser: InsertUser = {
      username: "demo_agent",
      password: "password_hash", // This would be hashed in a real implementation
      email: "agent@afrihome.com",
      fullName: "Demo Agent",
      phone: "+234 123 4567 890",
      isAgent: true
    };
    this.createUser(sampleUser).then(user => {
      // Sample property data
      const propertyData = [
        {
          title: "Luxury Villa in Lagos",
          description: "Beautiful luxury villa with modern amenities in the heart of Lagos.",
          price: 450000,
          bedrooms: 4,
          bathrooms: 3,
          area: 350,
          country: "Nigeria",
          city: "Lagos",
          neighborhood: "Lekki",
          address: "123 Lekki Road, Lagos",
          propertyType: "villa",
          listingType: "sale",
          yearBuilt: 2020,
          features: JSON.stringify(["Pool", "Garden", "Security", "Garage"]),
          mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]),
          featured: true
        },
        {
          title: "Modern Apartment in Nairobi",
          description: "Stylish modern apartment in the upscale Westlands area.",
          price: 220000,
          bedrooms: 2,
          bathrooms: 2,
          area: 120,
          country: "Kenya",
          city: "Nairobi",
          neighborhood: "Westlands",
          address: "45 Westlands Avenue, Nairobi",
          propertyType: "apartment",
          listingType: "sale",
          yearBuilt: 2018,
          features: JSON.stringify(["Security", "Parking", "Gym", "Furnished"]),
          mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]),
          featured: false
        },
        {
          title: "Family Home in Cape Town",
          description: "Spacious family home with garden and swimming pool in Constantia.",
          price: 380000,
          bedrooms: 5,
          bathrooms: 3,
          area: 420,
          country: "South Africa",
          city: "Cape Town",
          neighborhood: "Constantia",
          address: "78 Constantia Road, Cape Town",
          propertyType: "house",
          listingType: "sale",
          yearBuilt: 2010,
          features: JSON.stringify(["Pool", "Garden", "Garage", "Security"]),
          mainImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]),
          featured: true
        },
        {
          title: "Beachfront Property in Accra",
          description: "Stunning beachfront property with amazing sea views in Labadi.",
          price: 530000,
          bedrooms: 4,
          bathrooms: 4,
          area: 380,
          country: "Ghana",
          city: "Accra",
          neighborhood: "Labadi",
          address: "12 Labadi Beach Road, Accra",
          propertyType: "villa",
          listingType: "sale",
          yearBuilt: 2015,
          features: JSON.stringify(["Beach Access", "Pool", "Security", "Furnished"]),
          mainImage: "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1505081598304-3bee85f930d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]),
          featured: false
        },
        {
          title: "Luxury Apartment in Cairo",
          description: "Elegant luxury apartment in the prestigious Zamalek district.",
          price: 280000,
          bedrooms: 3,
          bathrooms: 2,
          area: 180,
          country: "Egypt",
          city: "Cairo",
          neighborhood: "Zamalek",
          address: "35 Zamalek Street, Cairo",
          propertyType: "apartment",
          listingType: "sale",
          yearBuilt: 2017,
          features: JSON.stringify(["Security", "Gym", "Parking", "River View"]),
          mainImage: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]),
          featured: false
        },
        {
          title: "Modern House in Dar es Salaam",
          description: "Contemporary house with panoramic views in the Masaki area.",
          price: 320000,
          bedrooms: 4,
          bathrooms: 3,
          area: 310,
          country: "Tanzania",
          city: "Dar es Salaam",
          neighborhood: "Masaki",
          address: "56 Masaki Road, Dar es Salaam",
          propertyType: "house",
          listingType: "sale",
          yearBuilt: 2019,
          features: JSON.stringify(["Ocean View", "Garden", "Security", "Garage"]),
          mainImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1574739782594-db4ead022697?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]),
          featured: true
        }
      ];

      // Add properties to storage
      propertyData.forEach(async property => {
        await this.createProperty({
          ...property,
          userId: user.id
        });
      });

      // Update properties to set featured flag
      for (let i = 0; i < 6; i++) {
        const property = this.properties.get(i + 1);
        if (property) {
          property.featured = [1, 3, 6].includes(i + 1);
          this.properties.set(i + 1, property);
        }
      }
    });
  }
}

export const storage = new MemStorage();
