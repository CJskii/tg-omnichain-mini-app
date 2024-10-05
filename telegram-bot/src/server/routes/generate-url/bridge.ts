import { Request, Response } from "express";
import { generateBridgeUrl } from "../../../utils";

export function bridgeRouteHandler(req: Request, res: Response) {
  const {
    botName,
    sourceChainId,
    targetChainId,
    contractAddress,
    ownerAddress,
    tokenId,
    uid,
    txType,
  } = req.body;

  if (!botName) {
    return res.status(400).json({ error: "botName is required" });
  }

  if (!sourceChainId) {
    return res.status(400).json({ error: "sourceChainId is required" });
  }

  if (!targetChainId) {
    return res.status(400).json({ error: "targetChainId is required" });
  }

  if (!contractAddress) {
    return res.status(400).json({ error: "contractAddress is required" });
  }

  if (!ownerAddress) {
    return res.status(400).json({ error: "ownerAddress is required" });
  }

  if (!tokenId) {
    return res.status(400).json({ error: "tokenId is required" });
  }

  if (!uid) {
    return res.status(400).json({ error: "uid is required" });
  }

  if (!txType) {
    return res.status(400).json({ error: "txType is required" });
  }

  try {
    const bridgeUrl = generateBridgeUrl({
      botName,
      sourceChainId,
      targetChainId,
      contractAddress,
      ownerAddress,
      tokenId,
      uid,
      txType,
    });
    console.log(`Generated bridge URL: ${bridgeUrl}`);
    res.json({ bridgeUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
