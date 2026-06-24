import { Link } from 'react-router-dom';
import type { HotelListItem } from '../types/hotel';
import { formatMoney, formatReviewScore } from '../utils/formatters';

interface HotelCardProps {
  hotel: HotelListItem;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <article className="hotel-card">
      <img
        className="hotel-card__image"
        src={hotel.thumbnail_url}
        alt={`${hotel.name} thumbnail`}
      />
      <div className="hotel-card__body">
        <div>
          <p className="eyebrow">
            {hotel.city}, {hotel.country}
          </p>
          <h2>{hotel.name}</h2>
          <p className="meta">
            {hotel.star_rating} stars · Review {formatReviewScore(hotel.review_score)}
          </p>
        </div>
        <div className="hotel-card__footer">
          <p className="price">From {formatMoney(hotel.min_price, hotel.currency)}</p>
          <Link className="button" to={`/hotels/${hotel.id}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
