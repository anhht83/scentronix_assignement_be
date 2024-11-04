import { findServer } from './services/server.service';

export const app = async () => {
  try {
    const lowestPriorityServer = await findServer([
      { url: 'https://does-not-work.perfume.new', priority: 1 },
      { url: 'https://gitlab.com', priority: 4 },
      { url: 'http://app.scnt.me', priority: 3 },
      { url: 'https://offline.scentronix.com', priority: 2 },
    ]);
    console.log('Lowest Priority Online Server', lowestPriorityServer);
  } catch (error: any) {
    console.log(error.message);
  }
};
