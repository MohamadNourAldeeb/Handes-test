import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: `./.env` });

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
export default (app) => {
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
};
