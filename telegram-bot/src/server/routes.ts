import { Express, Request, Response } from "express";
import { Server as SocketServer } from "socket.io";
import { generateBridgeUrl, generateTransactionJson } from "./transaction";

import { generateMintTransaction, generateMintUrl } from "../utils";

export function initializeRoutes(app: Express, io: SocketServer) {
  app.post("/api/generate-bridge-url", (req: Request, res: Response) => {
    const { botName, txType, uid } = req.body;
    console.log({ botName: botName, txType: txType, uid: uid });

    const bridgeUrl = generateBridgeUrl(botName, txType, uid);
    console.log(`Generated bridge URL: ${bridgeUrl}`);
    res.json({ bridgeUrl });
  });

  app.post("/api/generate-mint-url", (req: Request, res: Response) => {
    const { botName, chainId, address, uid } = req.body;
    console.log({ botName, chainId, address, uid });

    try {
      const mintUrl = generateMintUrl({
        botName,
        chainId,
        address,
        uid,
      });

      console.log(`Generated mint URL: ${mintUrl}`);
      res.json({ mintUrl });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/transaction/:uid", (req: Request, res: Response) => {
    const { uid } = req.params;
    const { txType } = req.query;

    console.log("Transaction type:", txType);
    console.log("UID:", uid);

    if (!txType) {
      return res
        .status(400)
        .json({ error: "Transaction type (txType) is required." });
    }

    try {
      console.log("Generating JSON...");
      const transactionJson = generateTransactionJson(txType as string, uid);
      console.log("Generated JSON:", transactionJson);
      res.json(transactionJson);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

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
