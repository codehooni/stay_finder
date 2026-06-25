import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { BookingPage } from './pages/BookingPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { HotelListPage } from './pages/HotelListPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { StatesPage } from './pages/StatesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HotelListPage />,
      },
      {
        path: 'hotels/:hotelId',
        element: <HotelDetailPage />,
      },
      {
        path: 'booking',
        element: <BookingPage />,
      },
      {
        path: 'trips',
        element: <MyBookingsPage />,
      },
      {
        path: 'states',
        element: <StatesPage />,
      },
    ],
  },
]);
