import { FormEvent, useEffect, useState } from 'react';
import { HotelCard } from '../components/HotelCard';
import { StateBlock } from '../components/StateBlock';
import { getHotels } from '../api/hotels';
import { toUserMessage } from '../api/client';
import type { HotelListItem } from '../types/hotel';

type LoadState = 'loading' | 'success' | 'empty' | 'error';

export function HotelListPage() {
  const [cityInput, setCityInput] = useState('seoul');
  const [activeCity, setActiveCity] = useState('seoul');
  const [hotels, setHotels] = useState<HotelListItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadHotels() {
      setLoadState('loading');
      setErrorMessage('');

      try {
        const result = await getHotels({ city: activeCity });
        if (!isActive) {
          return;
        }

        setHotels(result);
        setLoadState(result.length > 0 ? 'success' : 'empty');
      } catch (error) {
        if (!isActive) {
          return;
        }

        setHotels([]);
        setErrorMessage(toUserMessage(error));
        setLoadState('error');
      }
    }

    loadHotels();

    return () => {
      isActive = false;
    };
  }, [activeCity, retryTick]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextCity = cityInput.trim();

    if (nextCity === activeCity) {
      setRetryTick((tick) => tick + 1);
      return;
    }

    setActiveCity(nextCity);
  }

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Hotel search</p>
          <h1>Find stays by city</h1>
        </div>
        <form className="filter-form" onSubmit={handleSubmit}>
          <label htmlFor="city">City</label>
          <div className="filter-form__row">
            <input
              id="city"
              name="city"
              placeholder="seoul"
              value={cityInput}
              onChange={(event) => setCityInput(event.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>

      {loadState === 'loading' && (
        <StateBlock title="Loading hotels" body="Fetching public StayFinder hotels." />
      )}

      {loadState === 'error' && (
        <StateBlock
          title="Could not load hotels"
          body={errorMessage}
          action={
            <button type="button" onClick={() => setRetryTick((tick) => tick + 1)}>
              Retry
            </button>
          }
        />
      )}

      {loadState === 'empty' && (
        <StateBlock
          title="No hotels found"
          body="Try another city slug, such as seoul."
        />
      )}

      {loadState === 'success' && (
        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </section>
  );
}
