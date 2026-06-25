import { Link } from 'react-router-dom';
import type { HotelCardData, RoomData, TripData } from '../data/coastal';
import { statusMeta } from '../data/coastal';

export function Icon({ name, filled = false }: { name: string; filled?: boolean }) {
  return <span className={filled ? 'ms ms-filled' : 'ms'}>{name}</span>;
}

export function PhoneFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`phone-frame ${className}`}>
      {children}
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="status-icons">
        <Icon name="signal_cellular_alt" filled />
        <Icon name="wifi" filled />
        <Icon name="battery_full" filled />
      </span>
    </div>
  );
}

export function StripeImage({ variant = 'a', className = '' }: { variant?: 'a' | 'b' | 'hero'; className?: string }) {
  return <div className={`stripe-image stripe-${variant} ${className}`} />;
}

export function HotelCard({ hotel, compact = false }: { hotel: HotelCardData; compact?: boolean }) {
  return (
    <article className={compact ? 'hotel-card coastal-card desktop-hotel-card' : 'hotel-card coastal-card'}>
      <div className="hotel-card-media">
        <StripeImage variant={hotel.image} />
        <button className="round-icon" type="button" aria-label="Save hotel">
          <Icon name="favorite" />
        </button>
        <span className="image-pill">{hotel.tag}</span>
      </div>
      <div className="hotel-card-content">
        <div className="hotel-card-topline">
          <div>
            <h3>{hotel.name}</h3>
            <p className="muted inline-icon"><Icon name="location_on" />{hotel.loc}</p>
          </div>
          <span className="rating-badge"><Icon name="star" filled />{hotel.rating}</span>
        </div>
        <div className="amenity-row">
          {hotel.tags.map((tag) => (
            <span className="chip subtle-chip" key={`${hotel.id}-${tag.label}`}>
              <Icon name={tag.icon} />
              {tag.label}
            </span>
          ))}
        </div>
        <div className="hotel-card-footer">
          <p><span className="muted">from </span><strong>{hotel.price}</strong><span className="muted"> /night</span></p>
          <Link className="btn small" to={`/hotels/${hotel.id}`}>Details</Link>
        </div>
      </div>
    </article>
  );
}

export function RoomCard({ room, desktop = false }: { room: RoomData; desktop?: boolean }) {
  return (
    <article className={desktop ? 'room-card desktop-room-card' : 'room-card'}>
      <StripeImage variant={room.image} className="room-thumb" />
      <div className="room-body">
        <div className="room-title-row">
          <h3>{room.name}</h3>
          {room.tag && <span className="mini-tag">{room.tag}</span>}
        </div>
        <div className="room-facts-row">
          <span><Icon name="king_bed" />{room.bed}</span>
          <span><Icon name="group" />{room.guests}</span>
          {desktop && <span><Icon name="crop_free" />{room.size}</span>}
        </div>
        <div className="room-footer">
          <p><strong>{room.price}</strong><span className="muted"> /night</span></p>
          <Link className="btn small" to="/booking">Reserve</Link>
        </div>
      </div>
    </article>
  );
}

export function TripCard({ trip }: { trip: TripData }) {
  const meta = statusMeta[trip.status];
  return (
    <article className="trip-card">
      <div className="trip-top">
        <StripeImage variant={trip.image} className="trip-thumb" />
        <div className="trip-copy">
          <div className="trip-heading">
            <h3>{trip.hotel}</h3>
            <span className={`status-pill ${meta.className}`}><span />{meta.label}</span>
          </div>
          <p className="muted">{trip.city}</p>
          <p className="inline-icon trip-date"><Icon name="calendar_month" />{trip.dates}</p>
        </div>
      </div>
      <div className="trip-bottom">
        <p className="muted">{trip.guests} · <strong>{trip.total}</strong></p>
        <button className="text-action" type="button">{meta.action}</button>
      </div>
    </article>
  );
}

export function StatePanel({
  icon,
  title,
  body,
  tone = 'aqua',
  action,
}: {
  icon: string;
  title: string;
  body: string;
  tone?: 'aqua' | 'coral' | 'amber';
  action?: React.ReactNode;
}) {
  return (
    <section className="state-panel">
      <div className={`state-icon state-${tone}`}>
        <Icon name={icon} />
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </section>
  );
}
