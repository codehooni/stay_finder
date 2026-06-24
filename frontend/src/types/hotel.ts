export type CurrencyCode = 'KRW' | 'USD' | string;

export interface RoomType {
  id: number;
  name: string;
  description: string;
  max_guests: number;
  total_rooms: number;
  nightly_price: string;
  currency: CurrencyCode;
}

export interface HotelListItem {
  id: number;
  name: string;
  city: string;
  country: string;
  star_rating: number;
  review_score: string;
  min_price: string;
  currency: CurrencyCode;
  thumbnail_url: string;
}

export interface HotelDetail extends HotelListItem {
  description: string;
  address: string;
  room_types: RoomType[];
}

export interface HotelSearchParams {
  city?: string;
}
