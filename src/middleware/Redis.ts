import { createClient } from "redis";
import { promisify } from "util";
const client = createClient({
  socket: {
    host: "127.0.0.1", // Use IPv4 address
    port: 6379,
  },
});
(async () => {
  await client.connect();
})();

async function getCache(key: string, cb: Function) {
  console.log("i am inside redis");
  const data = await client.get(key);
  if (data) {
    console.log("cache hit");
    return JSON.parse(data);
  }
  const getData = await cb();

  await client.setEx(key, 360, JSON.stringify(getData));
  console.log("cache miss");
  return getData;
}
export default getCache;
