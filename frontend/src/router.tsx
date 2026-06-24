import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { HotelListPage } from './pages/HotelListPage';

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
    ],
  },
]);
