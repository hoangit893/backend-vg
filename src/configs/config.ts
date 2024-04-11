import dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME: string = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD: string = process.env.MONGO_PASSWORD || "";
const MONGO_URI: string = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.6bath.mongodb.net/vg`;

const SERVER_PORT: number = Number(process.env.SEVER_PORT) || 3000;
const JWT_SECRET: string = process.env.JWT || "default-secret";
const HASH_SALT: number = Number(process.env.HASH_SALT) || 10;
const USER: string = process.env.USER || "default-user";
const PASSWORD: string = process.env.PASSWORD || "default-password";

export const config = {
  mongo: {
    url: MONGO_URI,
  },
  server: {
    port: SERVER_PORT,
  },
  jwt: {
    secret: JWT_SECRET,
  },
  saltRounds: HASH_SALT,
  sender: {
    user: USER,
    pass: PASSWORD,
  },
};
