import Redis from "ioredis";

const redis = new Redis({
  host: "localhost",
  port: 6379,
  db: 1,
});

// redis.on("connect", function () {
//   console.log("Redis Connected ✅");
// });

// redis.on("ready", function () {
//   console.log("Redis Ready ✅");
// });
// this for add new row in redis cash
export let addToRedisCache = async (
  key,
  payload,
  time = 360 * 24 * 60 * 60
) => {
  await redis.set(key, payload, "EX", time);
};

// this for get cash by key
export let getFromRedisCache = async (key) => await redis.get(key);

// this for get all cash records and you can empty it from here by uncomment the row : 36
export let getAllInRedis = async () => {
  let all = await redis.keys("*", (err) => {
    if (err) return console.log(err);
  });
  all.forEach(async (element) => {
    let value = await redis.get(element);
    // deleteFromRedis(element);
    console.log({ key: element, value });
  });
};
// this for delete record fby key
export let deleteFromRedis = async (key) => {
  await redis.del(key, function (err, response) {
    if (response === 1) {
      // console.log('Deleted Successfully ✅');
    } else {
      // console.log('Cannot delete' + { err });
    }
  });
};
