import { Express } from "express";
import { Server as SocketServer } from "socket.io";
import { generateBridgeUrl, generateTransactionJson } from "./transaction";

export function initializeRoutes(app: Express, io: SocketServer) {
  app.post("/api/generate-bridge-url", (req, res) => {
    const { botName, txType, uid } = req.body;

    const bridgeUrl = generateBridgeUrl(botName, txType, uid);
    console.log(`Generated bridge URL: ${bridgeUrl}`);
    res.json({ bridgeUrl });
  });

  app.get("/api/transaction/:uid", (req, res) => {
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

  app.post("/api/transaction-callback", (req, res) => {
    const { uid, status, transactionHash } = req.body;
    io.emit(`transactionUpdate:${uid}`, { status, transactionHash });
    console.log(`Transaction callback received for UID ${uid}:`, {
      status,
      transactionHash,
    });

    res.status(200).send("Callback processed");
  });
}
