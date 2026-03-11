export type Occasion = "date" | "friends" | "family" | "solo" | "business" | "celebration";
export type PriceRange = "budget" | "moderate" | "expensive" | "luxury";
export type RecommendationLevel = "must_try" | "worth_it" | "decent" | "skip";
export type PhotoType = "food" | "interior" | "menu" | "exterior";
export type FlavorTag = "spicy" | "sweet" | "smoky" | "tangy" | "creamy" | "savory" | "bitter" | "umami" | "fresh" | "rich";

export interface RestaurantVisit {
  id: string;
  user_id: string;
  restaurant_name: string;
  location: string;
  cuisine: string;
  date_visited: string;
  occasion: Occasion;
  companions: string | null;
  price_range: PriceRange;
  ambience_rating: number;
  service_rating: number;
  food_rating: number;
  value_rating: number;
  overall_rating: number;
  experience_notes: string | null;
  would_return: boolean;
  recommendation_level: RecommendationLevel;
  created_at: string;
  dishes?: Dish[];
  photos?: Photo[];
}

export interface Dish {
  id: string;
  visit_id: string;
  dish_name: string;
  price: number | null;
  rating: number;
  notes: string | null;
  flavor_tags: FlavorTag[];
  image_url: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  visit_id: string;
  image_url: string;
  type: PhotoType;
  caption: string | null;
  created_at: string;
}

export interface AnalyticsData {
  totalRestaurants: number;
  averageRating: number;
  favoriteCuisines: { cuisine: string; count: number }[];
  topRatedRestaurants: { name: string; rating: number; cuisine: string }[];
  priceDistribution: { range: string; count: number }[];
  occasionBreakdown: { occasion: string; count: number }[];
  ratingDistribution: { rating: string; count: number }[];
  monthlyVisits: { month: string; count: number }[];
}
