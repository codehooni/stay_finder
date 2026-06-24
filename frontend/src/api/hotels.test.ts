import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, API_BASE_URL, apiRequest } from './client';
import { getHotelDetail, getHotelRoomTypes, getHotels } from './hotels';

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    ...init,
  });

describe('hotel api client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds the hotel list city query through the shared client', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse([]));

    await getHotels({ city: ' Seoul ' });

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/api/hotels/?city=seoul`, {
      headers: { Accept: 'application/json' },
    });
  });

  it('calls detail and room type endpoints from hotels.ts', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({}))
      .mockResolvedValueOnce(jsonResponse([]));

    await getHotelDetail(7);
    await getHotelRoomTypes(7);

    expect(fetchMock).toHaveBeenNthCalledWith(1, `${API_BASE_URL}/api/hotels/7/`, {
      headers: { Accept: 'application/json' },
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, `${API_BASE_URL}/api/hotels/7/room-types/`, {
      headers: { Accept: 'application/json' },
    });
  });

  it('maps backend message errors into ApiError', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ message: 'City is not supported.' }, { status: 400 }),
    );

    await expect(apiRequest('/api/hotels/')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'City is not supported.',
      status: 400,
    });
  });
});
