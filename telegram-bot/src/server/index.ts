import express from "express";
import { createServer } from "http";
import { initializeRoutes } from "./routes";
import { initializeSocket } from "../utils/websocket";
import cors from "cors";
import { serverConfig } from "../config/server";
import "dotenv/config";

const app = express();
const server = createServer(app);

const allowedOrigins = serverConfig.allowedOrigins;

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const io = initializeSocket(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initializeRoutes(app, io);

server.listen(serverConfig.port, () => {
  console.log(
    `Server is running on port ${serverConfig.port} in ${process.env.NODE_ENV} mode.`
  );
});
