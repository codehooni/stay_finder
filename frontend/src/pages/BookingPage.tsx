import { Link } from 'react-router-dom';
import { Icon, PhoneFrame, StatusBar, StripeImage } from '../components/CoastalPrimitives';

export function BookingPage() {
  return (
    <section className="coastal-screen single-phone-screen">
      <PhoneFrame>
        <StatusBar />
        <div className="mobile-page-title">
          <Link className="round-icon" to="/hotels/1"><Icon name="arrow_back" /></Link>
          <h1>Confirm & pay</h1>
        </div>
        <main className="booking-flow">
          <section className="booking-hotel-card">
            <StripeImage variant="a" />
            <div>
              <h2>Maison Lumière</h2>
              <p>Le Marais, Paris</p>
              <span><Icon name="king_bed" />Deluxe King · 1 King bed</span>
            </div>
          </section>
          <section className="booking-card">
            <div className="date-pair">
              <div><small>CHECK-IN</small><strong>Wed, Aug 12</strong><span>After 3:00 PM</span></div>
              <div><small>CHECK-OUT</small><strong>Sat, Aug 15</strong><span>Before 11:00 AM</span></div>
            </div>
            <div className="guest-edit"><span><Icon name="group" />2 guests · 1 room</span><button type="button">Edit</button></div>
          </section>
          <section className="booking-card">
            <h2>Price details</h2>
            <div className="summary-line"><span>$182 x 3 nights</span><strong>$546</strong></div>
            <div className="summary-line"><span>Taxes & fees</span><strong>$58</strong></div>
            <div className="summary-line"><span>Service fee</span><strong>$0</strong></div>
            <div className="summary-total"><span>Total</span><strong>$604</strong></div>
            <p>Free cancellation until Aug 10. No charge today.</p>
          </section>
          <button className="btn request-button" type="button"><Icon name="lock" />Request to book</button>
          <p className="booking-note">You won't be charged until the host confirms.</p>
        </main>
      </PhoneFrame>
    </section>
  );
}
