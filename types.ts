
export interface Tour {
  id: string;
  title: string;
  destination: string;
  departureCity: string;
  departureDate: string;
  price?: number;
  image: string;
  isFull: boolean;
  status: 'upcoming' | 'past' | 'ongoing';
  description: string;
  itineraryLink: string;
}





export enum FilterType {
  DEPARTURE_CITY = 'departureCity',
  DESTINATION = 'destination',
  MONTH = 'month'
}

// Blog Post - 短文卡片式 (under 300 chars)
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  publishDate: string;
}

// Testimonial - 旅客評價
export interface Testimonial {
  id: string;
  name: string;
  tourName: string;
  quote: string;
  image: string;
  rating: number;
}

// Why Choose Us - 為什麼選我們
export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}
