
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

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'youtube' | 'instagram';
  title: string;
  content: string;
  date: string;
  thumbnail: string;
  link: string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  tourName: string;
  rating: number;
  avatar: string;
}

export enum FilterType {
  DEPARTURE_CITY = 'departureCity',
  DESTINATION = 'destination',
  MONTH = 'month'
}
