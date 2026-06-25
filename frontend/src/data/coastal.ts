export type Amenity = {
  icon: string;
  label: string;
};

export type HotelCardData = {
  id: number;
  name: string;
  loc: string;
  rating: string;
  reviews: string;
  price: string;
  tag: string;
  image: 'a' | 'b';
  tags: Amenity[];
};

export type RoomData = {
  id: number;
  name: string;
  bed: string;
  guests: string;
  size: string;
  price: string;
  tag?: string;
  image: 'a' | 'b';
};

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'rejected';

export type TripData = {
  id: number;
  hotel: string;
  city: string;
  dates: string;
  guests: string;
  total: string;
  status: BookingStatus;
  image: 'a' | 'b';
};

export const amenities: Amenity[] = [
  { icon: 'wifi', label: 'Free Wi-Fi' },
  { icon: 'pool', label: 'Outdoor pool' },
  { icon: 'restaurant', label: 'Restaurant' },
  { icon: 'fitness_center', label: 'Fitness center' },
  { icon: 'local_parking', label: 'Free parking' },
  { icon: 'spa', label: 'Spa & sauna' },
  { icon: 'ac_unit', label: 'Air conditioning' },
  { icon: 'pets', label: 'Pet friendly' },
];

export const hotels: HotelCardData[] = [
  {
    id: 1,
    name: 'Maison Lumière',
    loc: 'Le Marais, Paris',
    rating: '4.8',
    reviews: '1,204',
    price: '$182',
    tag: 'Free cancellation',
    image: 'a',
    tags: [
      { icon: 'wifi', label: 'Wi-Fi' },
      { icon: 'pool', label: 'Pool' },
      { icon: 'spa', label: 'Spa' },
    ],
  },
  {
    id: 2,
    name: 'Casa del Mar',
    loc: 'Belém, Lisbon',
    rating: '4.9',
    reviews: '2,031',
    price: '$140',
    tag: 'Breakfast included',
    image: 'b',
    tags: [
      { icon: 'beach_access', label: 'Beach' },
      { icon: 'free_breakfast', label: 'Breakfast' },
      { icon: 'local_parking', label: 'Parking' },
    ],
  },
  {
    id: 3,
    name: 'The Nordic Quarter',
    loc: 'Nyhavn, Copenhagen',
    rating: '4.7',
    reviews: '892',
    price: '$156',
    tag: 'Great value',
    image: 'a',
    tags: [
      { icon: 'wifi', label: 'Wi-Fi' },
      { icon: 'fitness_center', label: 'Gym' },
      { icon: 'restaurant', label: 'Dining' },
    ],
  },
  {
    id: 4,
    name: 'Sakura Stay Ginza',
    loc: 'Ginza, Tokyo',
    rating: '4.6',
    reviews: '1,540',
    price: '$210',
    tag: 'Popular',
    image: 'b',
    tags: [
      { icon: 'wifi', label: 'Wi-Fi' },
      { icon: 'spa', label: 'Onsen' },
      { icon: 'ac_unit', label: 'A/C' },
    ],
  },
];

export const rooms: RoomData[] = [
  {
    id: 1,
    name: 'Standard Queen',
    bed: '1 Queen bed',
    guests: '2 guests',
    size: '24 m²',
    price: '$140',
    image: 'a',
  },
  {
    id: 2,
    name: 'Deluxe King',
    bed: '1 King bed',
    guests: '2 guests',
    size: '32 m²',
    price: '$182',
    tag: 'Most booked',
    image: 'b',
  },
  {
    id: 3,
    name: 'Executive Suite',
    bed: '1 King + sofa',
    guests: '3 guests',
    size: '48 m²',
    price: '$260',
    image: 'a',
  },
];

export const statusMeta = {
  confirmed: { label: 'Confirmed', className: 'status-confirmed', action: 'Cancel booking' },
  pending: { label: 'Pending', className: 'status-pending', action: 'Cancel request' },
  completed: { label: 'Completed', className: 'status-completed', action: 'Book again' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled', action: 'View details' },
  rejected: { label: 'Rejected', className: 'status-rejected', action: 'Find similar' },
} satisfies Record<BookingStatus, { label: string; className: string; action: string }>;

export const trips: TripData[] = [
  {
    id: 1,
    hotel: 'Maison Lumière',
    city: 'Paris, France',
    dates: 'Aug 12 - 15, 2026',
    guests: '2 guests · 1 room',
    total: '$604',
    status: 'confirmed',
    image: 'a',
  },
  {
    id: 2,
    hotel: 'Sakura Stay Ginza',
    city: 'Tokyo, Japan',
    dates: 'Sep 03 - 06, 2026',
    guests: '1 guest · 1 room',
    total: '$630',
    status: 'pending',
    image: 'b',
  },
  {
    id: 3,
    hotel: 'Casa del Mar',
    city: 'Lisbon, Portugal',
    dates: 'Jul 20 - 22, 2026',
    guests: '2 guests · 1 room',
    total: '$280',
    status: 'completed',
    image: 'a',
  },
  {
    id: 4,
    hotel: 'The Nordic Quarter',
    city: 'Copenhagen, Denmark',
    dates: 'Jun 01 - 03, 2026',
    guests: '2 guests · 1 room',
    total: '$312',
    status: 'cancelled',
    image: 'b',
  },
  {
    id: 5,
    hotel: 'Alpine Lodge',
    city: 'Zurich, Switzerland',
    dates: 'May 10 - 12, 2026',
    guests: '4 guests · 2 rooms',
    total: '$720',
    status: 'rejected',
    image: 'a',
  },
];

export const chips = [
  { icon: 'tune', label: 'Filters', active: true },
  { icon: 'pool', label: 'Pool' },
  { icon: 'verified', label: 'Free cancel' },
  { icon: 'star', label: '4.5+' },
];
