import { trips } from '../data/coastal';
import { PhoneFrame, StatusBar, TripCard } from '../components/CoastalPrimitives';

export function MyBookingsPage() {
  return (
    <section className="coastal-screen single-phone-screen">
      <PhoneFrame>
        <StatusBar />
        <div className="trips-heading"><h1>My trips</h1></div>
        <div className="trip-tabs">
          <span className="active">All</span>
          <span>Upcoming</span>
          <span>Past</span>
        </div>
        <main className="trip-list">
          {trips.map((trip) => <TripCard trip={trip} key={trip.id} />)}
        </main>
      </PhoneFrame>
    </section>
  );
}
