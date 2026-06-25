import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelDetail, getHotelRoomTypes } from '../api/hotels';
import { toUserMessage } from '../api/client';
import type { HotelDetail, RoomType } from '../types/hotel';
import {
  formatMoney,
  getDisplayAmenities,
  getHotelDescription,
  toRoomData,
} from '../utils/hotelDisplay';
import { Icon, PhoneFrame, RoomCard, StatePanel, StripeImage } from '../components/CoastalPrimitives';

export function HotelDetailPage() {
  const { hotelId = '1' } = useParams();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHotelDetail() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [hotelPayload, roomPayload] = await Promise.all([
          getHotelDetail(hotelId),
          getHotelRoomTypes(hotelId),
        ]);

        if (isMounted) {
          setHotel(hotelPayload);
          setRoomTypes(roomPayload);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(toUserMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHotelDetail();

    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  const amenities = getDisplayAmenities();
  const rooms = useMemo(
    () => roomTypes.map((room, index) => toRoomData(room, index)),
    [roomTypes],
  );
  const hotelName = hotel?.name ?? 'StayFinder hotel';
  const hotelLocation = hotel ? `${hotel.city}, ${hotel.country}` : 'Loading location';
  const hotelAddress = hotel ? `${hotel.address}, ${hotel.city} · ${hotel.country}` : 'Loading address';
  const heroPrice = formatMoney(hotel?.min_price, hotel?.currency);
  const description = getHotelDescription(hotel);
  const reviewScore = hotel?.review_score ?? '-';
  const reviewCount = hotel ? `${hotel.star_rating} star` : '';

  if (!isLoading && errorMessage) {
    return (
      <section className="coastal-screen detail-screen">
        <PhoneFrame className="detail-phone">
          <div className="mobile-page-title">
            <Link className="round-icon" to="/"><Icon name="arrow_back" /></Link>
            <h1>Hotel detail</h1>
          </div>
          <StatePanel
            icon="cloud_off"
            title="Backend not connected"
            body={errorMessage}
            tone="coral"
          />
        </PhoneFrame>
      </section>
    );
  }

  return (
    <section className="coastal-screen detail-screen">
      <PhoneFrame className="detail-phone">
        <div className="mobile-detail-hero">
          <StripeImage variant="hero" />
          <div className="detail-hero-actions">
            <Link className="round-icon large" to="/"><Icon name="arrow_back" /></Link>
            <div>
              <button className="round-icon large" type="button"><Icon name="share" /></button>
              <button className="round-icon large" type="button"><Icon name="favorite" /></button>
            </div>
          </div>
          <span className="photo-count">1 / 8</span>
        </div>
        <section className="mobile-detail-body">
          <div className="detail-title-row">
            <div>
              <h1>{hotelName}</h1>
              <p className="muted inline-icon"><Icon name="location_on" />{hotelAddress}</p>
            </div>
            <span className="score-card"><Icon name="star" filled />{reviewScore}<small>{reviewCount}</small></span>
          </div>
          <p className="body-copy">
            {isLoading ? 'Loading hotel details from the StayFinder backend.' : description}
          </p>
          <div className="section-title-row">
            <h2>Amenities</h2>
          </div>
          <div className="amenity-grid">
            {amenities.map((amenity) => (
              <div className="amenity-tile" key={amenity.label}>
                <span><Icon name={amenity.icon} /></span>
                <p>{amenity.label}</p>
              </div>
            ))}
          </div>
          <div className="section-title-row room-title">
            <h2>Choose your room</h2>
            <span>{isLoading ? 'Loading' : `${rooms.length} types`}</span>
          </div>
          {isLoading && <DetailSkeleton />}
          {!isLoading && rooms.length === 0 && (
            <StatePanel
              icon="bedroom_parent"
              title="No room types yet"
              body="Seed or create room types in the backend to make this stay bookable."
              tone="amber"
            />
          )}
          {!isLoading && rooms.length > 0 && (
            <div className="room-stack">
              {rooms.map((room) => <RoomCard room={room} key={room.id} />)}
            </div>
          )}
        </section>
        <div className="mobile-sticky-reserve">
          <div><span>from </span><strong>{heroPrice}</strong><span> /night</span></div>
          <Link className="btn" to="/booking">Select room</Link>
        </div>
      </PhoneFrame>

      <section className="desktop-detail-shell">
        <div className="breadcrumbs"><span>{hotel?.city ?? 'Hotel'}</span><Icon name="chevron_right" />{hotel?.country ?? 'Location'}<Icon name="chevron_right" /><strong>{hotelName}</strong></div>
        <div className="desktop-detail-head">
          <div>
            <h1>{hotelName}</h1>
            <p><Icon name="star" filled />{reviewScore} <span>{reviewCount}</span> <Icon name="location_on" />{hotelAddress}</p>
          </div>
          <div className="desktop-actions">
            <button type="button"><Icon name="share" />Share</button>
            <button type="button"><Icon name="favorite" />Save</button>
          </div>
        </div>
        <div className="photo-grid">
          <StripeImage variant="hero" />
          <StripeImage variant="a" />
          <StripeImage variant="b" />
          <StripeImage variant="b" />
          <div className="more-photos"><StripeImage variant="a" /><span>+12 photos</span></div>
        </div>
        <div className="desktop-detail-content">
          <div className="desktop-detail-main">
            <h2>About this stay</h2>
            <p>{isLoading ? 'Loading hotel details from the StayFinder backend.' : description}</p>
            <hr />
            <h2>Amenities</h2>
            <div className="desktop-amenities">
              {amenities.map((amenity) => <span key={amenity.label}><Icon name={amenity.icon} />{amenity.label}</span>)}
            </div>
            <hr />
            <h2>Choose your room</h2>
            {isLoading && <DetailSkeleton />}
            {!isLoading && rooms.length === 0 && (
              <StatePanel
                icon="bedroom_parent"
                title="No room types yet"
                body="Seed or create room types in the backend to make this stay bookable."
                tone="amber"
              />
            )}
            {!isLoading && rooms.length > 0 && (
              <div className="desktop-room-stack">{rooms.map((room) => <RoomCard room={room} desktop key={`desktop-${room.id}`} />)}</div>
            )}
          </div>
          <aside className="booking-summary-card">
            <p><span>from</span><strong>{heroPrice}</strong><span>/ night</span></p>
            <div className="summary-box">
              <div><small>CHECK-IN</small><strong>Aug 12</strong></div>
              <div><small>CHECK-OUT</small><strong>Aug 15</strong></div>
              <div className="summary-guests"><small>GUESTS</small><strong>2 guests · 1 room</strong><Icon name="expand_more" /></div>
            </div>
            <div className="summary-line"><span>$182 x 3 nights</span><strong>$546</strong></div>
            <div className="summary-line"><span>Taxes & fees</span><strong>$58</strong></div>
            <div className="summary-total"><span>Total</span><strong>$604</strong></div>
            <Link className="btn full" to="/booking">Reserve</Link>
            <p className="lock-note"><Icon name="lock" />Sign in required to book · no charge yet</p>
          </aside>
        </div>
      </section>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="skeleton-card detail-room-skeleton">
      <div />
      <span />
      <small />
    </div>
  );
}
