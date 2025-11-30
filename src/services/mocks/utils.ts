import type { AxiosResponse } from 'axios';

export const createMockAxiosResponse = <T>(data: T): AxiosResponse<T> =>
  ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: {},
    },
    request: {},
  }) as AxiosResponse<T>;
