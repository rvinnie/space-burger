import { refreshTokenAPI } from '@/api/space-api';

import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type WSActions<R, S> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting?: ActionCreatorWithoutPayload;
  onClose?: ActionCreatorWithoutPayload;
  onOpen?: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<R>;
  sendMessage?: ActionCreatorWithPayload<S>;
};

export const socketMiddleware = <A, B>(
  wsActions: WSActions<A, B>,
  withTokenRefresh = false
): Middleware<Record<string, never>, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;

    const {
      connect,
      disconnect,
      onConnecting,
      onClose,
      onOpen,
      onError,
      onMessage,
      sendMessage,
    } = wsActions;

    const { dispatch } = store;
    let url = '';

    return (next) => (action) => {
      if (connect.match(action)) {
        socket = new WebSocket(action.payload);
        url = action.payload;
        onConnecting && dispatch(onConnecting());

        socket.onopen = (): void => {
          onOpen && dispatch(onOpen());
        };
        socket.onclose = (): void => {
          onClose && dispatch(onClose());
        };
        socket.onerror = (): void => {
          dispatch(onError('Error'));
        };
        socket.onmessage = (event): void => {
          const { data } = event;

          try {
            const parsedData = JSON.parse(data);

            if (withTokenRefresh && parsedData.message === 'Invalid or missing token') {
              refreshTokenAPI()
                .then((refreshedData) => {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set(
                    'token',
                    refreshedData.data.accessToken.replace('Bearer ', '')
                  );
                  dispatch(connect(wssUrl.toString()));
                })
                .catch((error) => {
                  dispatch(onError((error as Error).message));
                });

              dispatch(disconnect());

              return;
            }

            dispatch(onMessage(parsedData));
          } catch (error) {
            dispatch(onError((error as Error).message));
          }
        };

        return;
      }

      if (socket && disconnect.match(action)) {
        socket.close();
        socket = null;

        return;
      }

      if (socket && sendMessage?.match(action)) {
        const { payload } = action;
        try {
          const stringifiedPayload = JSON.stringify(payload);
          socket.send(stringifiedPayload);
        } catch (error) {
          dispatch(onError((error as Error).message));
        }

        return;
      }

      return next(action);
    };
  };
};
