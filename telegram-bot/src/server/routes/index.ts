import { Express, Request, Response } from "express";
import { Server as SocketServer } from "socket.io";

import {
  signatureRouteHandler,
  mintRouteHandler,
  approveRouteHandler,
  bridgeRouteHandler,
} from "./generate-url";

import {
  signatureTransactionRouteHandler,
  mintTransactionRouteHandler,
  approveTransactionRouteHandler,
  bridgeTransactionRouteHandler,
} from "./transaction";

export function initializeRoutes(app: Express, io: SocketServer) {
  app.post("/api/generate-url/signature", signatureRouteHandler);
  app.post("/api/generate-url/mint", mintRouteHandler);
  app.post("/api/generate-url/approve", approveRouteHandler);
  app.post("/api/generate-url/bridge", bridgeRouteHandler);

  app.post("/api/transaction/mint/:uid", mintTransactionRouteHandler);
  app.post("/api/transaction/approve/:uid", approveTransactionRouteHandler);
  app.post("/api/transaction/signature/:uid", signatureTransactionRouteHandler);
  app.post("/api/transaction/bridge/:uid", bridgeTransactionRouteHandler);

  app.post("/api/transaction-callback", (req: Request, res: Response) => {
    const { uid, status, transactionHash } = req.body;
    io.emit(`transactionUpdate:${uid}`, { status, transactionHash });
    console.log(`Transaction callback received for UID ${uid}:`, {
      status,
      transactionHash,
    });

    res.status(200).send("Callback processed");
  });

  app.post("/api/test", (req: Request, res: Response) => {
    console.log("Test route hit");
    res.status(200).send("Test route hit");
  });
}
