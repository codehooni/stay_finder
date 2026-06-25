import { Link, Outlet } from 'react-router-dom';
import { Icon } from './CoastalPrimitives';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="top-bar desktop-top-bar">
        <Link className="brand" to="/">
          <Icon name="beach_access" filled />
          StayFinder
        </Link>
        <nav className="desktop-nav">
          <Link to="/">Stays</Link>
          <Link to="/trips">My trips</Link>
          <Link className="login-pill" to="/booking">Log in</Link>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
