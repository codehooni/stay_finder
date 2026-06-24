import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <Link className="brand" to="/">
          StayFinder
        </Link>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
