
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
