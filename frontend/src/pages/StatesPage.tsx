import { Link } from 'react-router-dom';
import { Icon, PhoneFrame, StatePanel } from '../components/CoastalPrimitives';

export function StatesPage() {
  return (
    <section className="state-gallery coastal-screen">
      <PhoneFrame>
        <div className="skeleton-page">
          <div className="skel hero" />
          <div className="skel-chip-row"><span /><span /><span /></div>
          <div className="skeleton-card"><div /><span /><small /></div>
          <div className="skeleton-card"><div /><span /><small /></div>
        </div>
      </PhoneFrame>
      <PhoneFrame>
        <StatePanel
          icon="travel_explore"
          title="No stays match your filters"
          body="Try widening your dates, raising the price range, or removing a few amenities."
          action={<button className="btn secondary" type="button">Clear all filters</button>}
        />
      </PhoneFrame>
      <PhoneFrame>
        <StatePanel
          icon="cloud_off"
          title="Something went wrong"
          body="We couldn't load stays right now. Check your connection and try again."
          tone="coral"
          action={<button className="btn" type="button"><Icon name="refresh" />Try again</button>}
        />
      </PhoneFrame>
      <PhoneFrame>
        <StatePanel
          icon="lock"
          title="Sign in to book"
          body="Browsing is free. You only need an account to reserve this stay."
          tone="amber"
          action={<Link className="btn" to="/booking">Continue</Link>}
        />
      </PhoneFrame>
    </section>
  );
}
