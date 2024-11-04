import axios, { AxiosResponse } from 'axios';
import { Server } from '../interfaces/server.interface';
import { CONFIG } from '../config';
import { OFFLINE_ERROR_MESSAGE } from '../constants/server.constants';

export async function findServer(servers: Server[]): Promise<Server> {
  const requests = servers.map((server) =>
    axios
      .get(server.url, { timeout: CONFIG.REQUEST_TIMEOUT })
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status < 300) {
          return server;
        }
        throw new Error('Server is offline');
      })
      .catch(() => null)
  );

  const results = await Promise.allSettled(requests).then((responses) => responses);

  const onlineServers: Server[] = results
    .filter((result) => result.status === 'fulfilled' && result.value !== null)
    .map((result) => (result as PromiseFulfilledResult<Server | null>).value as Server);

  if (onlineServers.length === 0) {
    throw new Error(OFFLINE_ERROR_MESSAGE);
  }

  // Return the lowest priority online server
  return onlineServers.sort((a, b) => a.priority - b.priority)[0];
}
