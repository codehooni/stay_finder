import { apiRequest } from './client';
import type { HotelDetail, HotelListItem, HotelSearchParams, RoomType } from '../types/hotel';

export function getHotels(params: HotelSearchParams = {}) {
  return apiRequest<HotelListItem[]>('/api/hotels/', {
    query: {
      city: params.city?.trim().toLowerCase(),
    },
  });
}

export function getHotelDetail(hotelId: number | string) {
  return apiRequest<HotelDetail>(`/api/hotels/${hotelId}/`);
}

export function getHotelRoomTypes(hotelId: number | string) {
  return apiRequest<RoomType[]>(`/api/hotels/${hotelId}/room-types/`);
}
