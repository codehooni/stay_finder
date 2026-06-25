import { useEffect, useMemo, useState } from 'react';
import { getHotels } from '../api/hotels';
import { toUserMessage } from '../api/client';
import { chips } from '../data/coastal';
import type { HotelListItem } from '../types/hotel';
import { toHotelCardData } from '../utils/hotelDisplay';
import { HotelCard, Icon, PhoneFrame, StatePanel, StatusBar } from '../components/CoastalPrimitives';

export function HotelListPage() {
  const [hotels, setHotels] = useState<HotelListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHotels() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const payload = await getHotels();

        if (isMounted) {
          setHotels(payload);
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

    void loadHotels();

    return () => {
      isMounted = false;
    };
  }, []);

  const hotelCards = useMemo(
    () => hotels.map((hotel, index) => toHotelCardData(hotel, index)),
    [hotels],
  );
  const resultLabel = isLoading ? 'Loading stays' : `${hotels.length} stays available`;

  return (
    <section className="coastal-screen hotel-list-screen">
      <PhoneFrame>
        <StatusBar />
        <section className="hero-search">
          <div className="mobile-brand-row">
            <div className="mobile-brand"><Icon name="beach_access" filled />StayFinder</div>
            <span>Log in</span>
          </div>
          <h1>Your next escape<br />starts here</h1>
          <div className="search-card">
            <div className="where-row">
              <Icon name="location_on" />
              <div>
                <span>WHERE</span>
                <strong>Paris, France</strong>
              </div>
            </div>
            <div className="search-card-bottom">
              <div>
                <span>DATES</span>
                <strong>Aug 12-15</strong>
              </div>
              <div>
                <span>GUESTS</span>
                <strong>2 guests</strong>
              </div>
              <button className="search-button" type="button" aria-label="Search">
                <Icon name="search" />
              </button>
            </div>
          </div>
        </section>

        <section className="list-content">
          <div className="chip-scroll">
            {chips.map((chip) => (
              <span className={chip.active ? 'chip active-chip' : 'chip'} key={chip.label}>
                <Icon name={chip.icon} />
                {chip.label}
              </span>
            ))}
          </div>
          <div className="result-heading">
            <h2>{resultLabel}</h2>
            <span><Icon name="swap_vert" />Top rated</span>
          </div>
          {isLoading && <ListSkeleton />}
          {!isLoading && errorMessage && (
            <StatePanel
              icon="cloud_off"
              title="Backend not connected"
              body={errorMessage}
              tone="coral"
            />
          )}
          {!isLoading && !errorMessage && hotelCards.length === 0 && (
            <StatePanel
              icon="search_off"
              title="No stays found"
              body="Try another city or seed demo hotels in the backend."
              tone="amber"
            />
          )}
          {!isLoading && !errorMessage && hotelCards.length > 0 && (
            <div className="mobile-card-stack">
              {hotelCards.map((hotel) => (
                <HotelCard hotel={hotel} key={hotel.id} />
              ))}
            </div>
          )}
        </section>
      </PhoneFrame>

      <section className="desktop-list-shell">
        <aside className="desktop-filters">
          <h2>Find your stay</h2>
          <div className="desktop-input"><Icon name="search" />Paris, France</div>
          <div className="desktop-input two-col"><span><small>CHECK-IN</small>Aug 12</span><span><small>CHECK-OUT</small>Aug 15</span></div>
          <div className="desktop-input"><Icon name="person" />2 guests · 1 room</div>
          <div className="filter-block">
            <h3>Popular filters</h3>
            <div className="desktop-filter-chips">
              <span>Pool</span><span>Free cancel</span><span>Beach</span><span>Breakfast</span>
            </div>
          </div>
          <div className="filter-block">
            <h3>Price range</h3>
            <div className="price-track"><span /></div>
            <div className="price-labels"><span>$80</span><span>$320+</span></div>
          </div>
          <div className="filter-block">
            <h3>Guest rating</h3>
            <div className="desktop-filter-chips"><span className="selected">4.5+</span><span>4.0+</span><span>3.5+</span></div>
          </div>
        </aside>
        <section className="desktop-results">
          <div className="desktop-results-head">
            <div>
              <h1>{resultLabel}</h1>
              <p>Aug 12 - 15 · 2 guests · 1 room</p>
            </div>
            <button className="sort-button" type="button"><Icon name="swap_vert" />Top rated<Icon name="expand_more" /></button>
          </div>
          {isLoading && <ListSkeleton />}
          {!isLoading && errorMessage && (
            <StatePanel
              icon="cloud_off"
              title="Backend not connected"
              body={errorMessage}
              tone="coral"
            />
          )}
          {!isLoading && !errorMessage && hotelCards.length === 0 && (
            <StatePanel
              icon="search_off"
              title="No stays found"
              body="Try another city or seed demo hotels in the backend."
              tone="amber"
            />
          )}
          {!isLoading && !errorMessage && hotelCards.length > 0 && (
            <div className="desktop-card-stack">
              {hotelCards.map((hotel) => (
                <HotelCard hotel={hotel} compact key={`desktop-${hotel.id}`} />
              ))}
            </div>
          )}
        </section>
      </section>
    </section>
  );
}

function ListSkeleton() {
  return (
    <div className="skeleton-page api-skeleton">
      <span className="skel hero" />
      <div className="skel-chip-row">
        <span />
        <span />
        <span />
      </div>
      <div className="skeleton-card">
        <div />
        <span />
        <small />
      </div>
      <div className="skeleton-card">
        <div />
        <span />
        <small />
      </div>
    </div>
  );
}
