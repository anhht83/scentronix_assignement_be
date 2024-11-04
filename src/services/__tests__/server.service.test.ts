import nock from 'nock';
import { findServer } from '../server.service';
import { Server } from '../../interfaces/server.interface';
import { OFFLINE_ERROR_MESSAGE } from '../../constants/server.constants';
import { CONFIG } from '../../config';

const mockServers: Server[] = [
  { url: "https://does-not-work.perfume.new", priority: 1 },
  { url: "https://gitlab.com", priority: 4 },
  { url: "http://app.scnt.me", priority: 3 },
  { url: "https://offline.scentronix.com", priority: 2 },
];

const OVER_TIMEOUT = CONFIG.REQUEST_TIMEOUT + 100;

describe("findServer", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it("should return the online server with the lowest priority", async () => {
    // Mock server responses
    nock("https://does-not-work.perfume.new").get("/").delay(OVER_TIMEOUT).reply(500);
    nock("https://gitlab.com").get("/").reply(200);
    nock("http://app.scnt.me").get("/").reply(200);
    nock("https://offline.scentronix.com").get("/").reply(500);

    const result = await findServer(mockServers);
    expect(result.url).toBe("http://app.scnt.me");
  });

  it("should throw an error if no servers are online", async () => {
    // Mock all servers as offline
    nock("https://does-not-work.perfume.new").get("/").reply(500);
    nock("https://gitlab.com").get("/").reply(500);
    nock("http://app.scnt.me").get("/").reply(500);
    nock("https://offline.scentronix.com").get("/").reply(500);

    await expect(findServer(mockServers)).rejects.toThrow(OFFLINE_ERROR_MESSAGE);
  });

  it("should handle request timeouts gracefully", async () => {
    // Mock responses with delays beyond the timeout limit
    nock("https://does-not-work.perfume.new").get("/").delay(OVER_TIMEOUT).reply(200);
    nock("https://gitlab.com").get("/").delay(OVER_TIMEOUT).reply(200);
    nock("http://app.scnt.me").get("/").delay(OVER_TIMEOUT).reply(200);
    nock("https://offline.scentronix.com").get("/").delay(OVER_TIMEOUT).reply(200);

    await expect(findServer(mockServers)).rejects.toThrow(OFFLINE_ERROR_MESSAGE);
  });

  it("should has failed request", async () => {
    // Mock responses with delays beyond the timeout limit
    nock("https://does-not-work.perfume.new").get("/").replyWithError('Error');
    nock("https://gitlab.com").get("/").reply(200);
    nock("http://app.scnt.me").get("/").reply(200);
    nock("https://offline.scentronix.com").get("/").reply(200);

    const result = await findServer(mockServers);
    expect(result.url).toBe("https://offline.scentronix.com");
  });
});
