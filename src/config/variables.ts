import { config } from 'dotenv';

config();

export default {
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  jwtEncryptionKey: process.env.JWT_ENCRYPTION_KEY,
  tokenExpire: process.env.JWT_TOKEN_EXPIRE,
  redisUrl: process.env.REDIS_URL,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  redisUser: process.env.REDIS_USER,
  emailSendUser: process.env.EMAIL_SEND_USER,
  emailSendPassword: process.env.EMAIL_SEND_PASSWORD,
};
