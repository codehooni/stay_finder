import { amenities, type Amenity, type HotelCardData, type RoomData } from '../data/coastal';
import type { HotelDetail, HotelListItem, RoomType } from '../types/hotel';

const defaultHotelTags: Amenity[] = [
  { icon: 'wifi', label: 'Wi-Fi' },
  { icon: 'verified', label: 'Free cancel' },
  { icon: 'restaurant', label: 'Dining' },
];

const currencySymbols: Record<string, string> = {
  KRW: '₩',
  USD: '$',
  EUR: '€',
  JPY: '¥',
};

export function formatMoney(amount: string | number | null | undefined, currency?: string | null) {
  if (amount === null || amount === undefined || amount === '') {
    return 'Price TBD';
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  const symbol = currency ? currencySymbols[currency] : undefined;
  if (symbol) {
    return `${symbol}${numericAmount.toLocaleString()}`;
  }

  return `${numericAmount.toLocaleString()}${currency ? ` ${currency}` : ''}`;
}

export function toHotelCardData(hotel: HotelListItem, index = 0): HotelCardData {
  return {
    id: hotel.id,
    name: hotel.name,
    loc: `${hotel.city}, ${hotel.country}`,
    rating: hotel.review_score,
    reviews: `${hotel.star_rating} star`,
    price: formatMoney(hotel.min_price, hotel.currency),
    tag: hotel.thumbnail_url ? 'Photo available' : 'Verified stay',
    image: index % 2 === 0 ? 'a' : 'b',
    tags: defaultHotelTags,
  };
}

export function toRoomData(room: RoomType, index = 0): RoomData {
  return {
    id: room.id,
    name: room.name,
    bed: index === 0 ? 'Queen bed' : 'King bed',
    guests: `${room.max_guests} guest${room.max_guests === 1 ? '' : 's'}`,
    size: `${room.total_rooms} rooms`,
    price: formatMoney(room.nightly_price, room.currency),
    tag: index === 0 ? 'Best value' : undefined,
    image: index % 2 === 0 ? 'a' : 'b',
  };
}

export function getHotelDescription(hotel: HotelDetail | null | undefined) {
  return hotel?.description?.trim()
    || 'A carefully selected StayFinder property with practical room options and verified local details.';
}

export function getDisplayAmenities() {
  return amenities;
}
