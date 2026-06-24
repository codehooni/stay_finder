import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getHotelDetail } from '../api/hotels';
import { toUserMessage } from '../api/client';
import { StateBlock } from '../components/StateBlock';
import type { HotelDetail } from '../types/hotel';
import { formatMoney, formatReviewScore } from '../utils/formatters';

type LoadState = 'loading' | 'success' | 'error';

export function HotelDetailPage() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadHotelDetail() {
      if (!hotelId) {
        setErrorMessage('Hotel id is missing from the route.');
        setLoadState('error');
        return;
      }

      setLoadState('loading');
      setErrorMessage('');

      try {
        const result = await getHotelDetail(hotelId);
        if (!isActive) {
          return;
        }

        setHotel(result);
        setLoadState('success');
      } catch (error) {
        if (!isActive) {
          return;
        }

        setHotel(null);
        setErrorMessage(toUserMessage(error));
        setLoadState('error');
      }
    }

    loadHotelDetail();

    return () => {
      isActive = false;
    };
  }, [hotelId]);

  if (loadState === 'loading') {
    return <StateBlock title="Loading hotel" body="Fetching hotel detail and room types." />;
  }

  if (loadState === 'error') {
    return (
      <StateBlock
        title="Could not load hotel"
        body={errorMessage}
        action={
          <Link className="button" to="/">
            Back to hotels
          </Link>
        }
      />
    );
  }

  if (!hotel) {
    return null;
  }

  return (
    <section className="page-stack">
      <Link className="text-link" to="/">
        Back to hotels
      </Link>

      <article className="detail-layout">
        <img
          className="detail-image"
          src={hotel.thumbnail_url}
          alt={`${hotel.name} thumbnail`}
        />
        <div className="detail-copy">
          <p className="eyebrow">
            {hotel.city}, {hotel.country}
          </p>
          <h1>{hotel.name}</h1>
          <p className="meta">
            {hotel.star_rating} stars · Review {formatReviewScore(hotel.review_score)}
          </p>
          <p>{hotel.description}</p>
          <p className="address">{hotel.address}</p>
          {hotel.min_price && (
            <p className="price">From {formatMoney(hotel.min_price, hotel.currency)}</p>
          )}
        </div>
      </article>

      <section className="room-section">
        <div className="section-heading">
          <p className="eyebrow">Room types</p>
          <h2>Available rooms</h2>
        </div>
        {hotel.room_types.length === 0 ? (
          <StateBlock
            title="No room types"
            body="This hotel does not have public room types yet."
          />
        ) : (
          <div className="room-grid">
            {hotel.room_types.map((roomType) => (
              <article className="room-card" key={roomType.id}>
                <div>
                  <h3>{roomType.name}</h3>
                  <p>{roomType.description}</p>
                </div>
                <dl className="room-facts">
                  <div>
                    <dt>Max guests</dt>
                    <dd>{roomType.max_guests}</dd>
                  </div>
                  <div>
                    <dt>Total rooms</dt>
                    <dd>{roomType.total_rooms}</dd>
                  </div>
                  <div>
                    <dt>Nightly</dt>
                    <dd>{formatMoney(roomType.nightly_price, roomType.currency)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
