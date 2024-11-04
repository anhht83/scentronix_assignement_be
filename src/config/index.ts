import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || "5000", 10),
};
