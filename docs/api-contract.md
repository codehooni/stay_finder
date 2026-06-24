# StayFinder API Contract

This document is the coordination point between the Django/DRF backend and the React frontend.

Rules:

- Backend changes that affect request/response shape must update this file first.
- Frontend code should call APIs through `frontend/src/api/*`, not directly inside components.
- Booking price, user ownership, and booking status are server-owned values.

## Auth

### `POST /api/auth/register/`

Request:

```json
{
  "email": "guest@example.com",
  "password": "strong-password",
  "first_name": "Jihun",
  "last_name": "Lee"
}
```

Response `201`:

```json
{
  "id": 1,
  "email": "guest@example.com",
  "first_name": "Jihun",
  "last_name": "Lee"
}
```

### `POST /api/auth/token/`

Request:

```json
{
  "email": "guest@example.com",
  "password": "strong-password"
}
```

Response `200`:

```json
{
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token"
}
```

### `POST /api/auth/token/refresh/`

Request:

```json
{
  "refresh": "jwt-refresh-token"
}
```

Response `200`:

```json
{
  "access": "new-jwt-access-token"
}
```

## Hotels

### `GET /api/hotels/`

Purpose:

- Search hotels by city, date range, guests, price, amenities, and ordering.

Query params:

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `city` | string | no | Case-insensitive city search |
| `check_in` | date | no | `YYYY-MM-DD` |
| `check_out` | date | no | `YYYY-MM-DD`; must be after `check_in` when both exist |
| `guests` | integer | no | Filters hotels with at least one matching room type |
| `min_price` | decimal | no | Minimum nightly room price |
| `max_price` | decimal | no | Maximum nightly room price |
| `amenities` | string | no | Comma-separated amenity slugs |
| `ordering` | string | no | `price`, `-price`, `rating`, `-rating` |

Response `200`:

```json
[
  {
    "id": 1,
    "name": "StayFinder Seoul Central",
    "city": "Seoul",
    "country": "South Korea",
    "star_rating": 4,
    "review_score": "4.6",
    "min_price": "180000.00",
    "currency": "KRW",
    "thumbnail_url": "https://example.com/hotel.jpg",
    "amenities": ["wifi", "breakfast", "parking"]
  }
]
```

### `GET /api/hotels/{hotel_id}/`

Response `200`:

```json
{
  "id": 1,
  "name": "StayFinder Seoul Central",
  "description": "Business-friendly hotel near major transit.",
  "address": "1 Central Road",
  "city": "Seoul",
  "country": "South Korea",
  "star_rating": 4,
  "review_score": "4.6",
  "images": [
    {
      "id": 10,
      "url": "https://example.com/hotel-lobby.jpg",
      "alt": "Hotel lobby"
    }
  ],
  "amenities": [
    {
      "slug": "wifi",
      "name": "Wi-Fi"
    }
  ],
  "room_types": [
    {
      "id": 100,
      "name": "Deluxe Double",
      "description": "Double bed room for two guests.",
      "max_guests": 2,
      "total_rooms": 12,
      "nightly_price": "180000.00",
      "currency": "KRW"
    }
  ]
}
```

## Bookings

Booking status values:

- `pending`
- `approved`
- `rejected`
- `cancelled`

### `POST /api/bookings/`

Auth:

- Required.

Request:

```json
{
  "room_type": 100,
  "check_in": "2026-08-01",
  "check_out": "2026-08-04",
  "guests": 2
}
```

Server-side validation:

- The user comes from `request.user`.
- `check_in < check_out`.
- Past dates are rejected.
- `guests <= room_type.max_guests`.
- Overlapping approved or pending booking count must be lower than `room_type.total_rooms`.
- `total_price` is calculated by the server.
- Client-provided `user_id`, `total_price`, and `status` are ignored or rejected.

Response `201`:

```json
{
  "id": 500,
  "hotel": {
    "id": 1,
    "name": "StayFinder Seoul Central",
    "city": "Seoul",
    "country": "South Korea"
  },
  "room_type": {
    "id": 100,
    "name": "Deluxe Double"
  },
  "check_in": "2026-08-01",
  "check_out": "2026-08-04",
  "guests": 2,
  "nights": 3,
  "total_price": "540000.00",
  "currency": "KRW",
  "status": "pending",
  "created_at": "2026-06-24T12:00:00Z"
}
```

Validation error `400`:

```json
{
  "code": "booking_unavailable",
  "message": "This room type is not available for the selected dates.",
  "fields": {
    "check_in": ["Selected dates overlap with existing bookings."]
  }
}
```

### `GET /api/bookings/`

Auth:

- Required.
- Normal users see their own bookings.
- Staff users may see all bookings when backend permissions allow it.

Response `200`:

```json
[
  {
    "id": 500,
    "hotel_name": "StayFinder Seoul Central",
    "room_type_name": "Deluxe Double",
    "check_in": "2026-08-01",
    "check_out": "2026-08-04",
    "guests": 2,
    "total_price": "540000.00",
    "currency": "KRW",
    "status": "pending"
  }
]
```

### `GET /api/bookings/{booking_id}/`

Auth:

- Required.
- Normal users can only access their own booking.
- Staff users can access bookings for admin workflows.

Response `200`:

```json
{
  "id": 500,
  "hotel": {
    "id": 1,
    "name": "StayFinder Seoul Central",
    "city": "Seoul",
    "country": "South Korea"
  },
  "room_type": {
    "id": 100,
    "name": "Deluxe Double"
  },
  "check_in": "2026-08-01",
  "check_out": "2026-08-04",
  "guests": 2,
  "nights": 3,
  "total_price": "540000.00",
  "currency": "KRW",
  "status": "pending",
  "created_at": "2026-06-24T12:00:00Z",
  "updated_at": "2026-06-24T12:00:00Z"
}
```

### `POST /api/bookings/{booking_id}/cancel/`

Auth:

- Required.
- Normal users can cancel only their own pending or approved bookings.

Response `200`:

```json
{
  "id": 500,
  "status": "cancelled"
}
```

### `POST /api/admin/bookings/{booking_id}/approve/`

Auth:

- Staff only.

Response `200`:

```json
{
  "id": 500,
  "status": "approved"
}
```

### `POST /api/admin/bookings/{booking_id}/reject/`

Auth:

- Staff only.

Request:

```json
{
  "reason": "Room inventory changed."
}
```

Response `200`:

```json
{
  "id": 500,
  "status": "rejected",
  "rejection_reason": "Room inventory changed."
}
```

## Reviews

### `POST /api/hotels/{hotel_id}/reviews/`

Auth:

- Required.
- User must have an approved or completed booking for the hotel.

Request:

```json
{
  "rating": 5,
  "comment": "Clean room and fast check-in."
}
```

Response `201`:

```json
{
  "id": 900,
  "hotel": 1,
  "rating": 5,
  "comment": "Clean room and fast check-in.",
  "author_name": "Jihun",
  "created_at": "2026-06-24T12:00:00Z"
}
```

### `GET /api/hotels/{hotel_id}/reviews/`

Response `200`:

```json
[
  {
    "id": 900,
    "rating": 5,
    "comment": "Clean room and fast check-in.",
    "author_name": "Jihun",
    "created_at": "2026-06-24T12:00:00Z"
  }
]
```

## Frontend API Modules

Expected React API layer:

```txt
frontend/src/api/
  client.ts
  auth.ts
  hotels.ts
  bookings.ts
  reviews.ts
```

Functions:

- `login(payload)`
- `refreshToken(refresh)`
- `getHotels(params)`
- `getHotelDetail(hotelId)`
- `createBooking(payload)`
- `getMyBookings()`
- `getBookingDetail(bookingId)`
- `cancelBooking(bookingId)`
- `approveBooking(bookingId)`
- `rejectBooking(bookingId, reason)`
- `getHotelReviews(hotelId)`
- `createReview(hotelId, payload)`
