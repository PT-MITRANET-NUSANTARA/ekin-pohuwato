import Redis from 'ioredis';
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORDD
const redis = new Redis({
  host: host,
  port: port,       
  password: password,     
});

export default redis;