import { Request, Response } from "express";
import { generateMintUrl } from "../../../utils";

export function mintRouteHandler(req: Request, res: Response) {
  const { botName, chainId, address, uid, txType } = req.body;

  if (!botName) {
    return res.status(400).json({ error: "Bot name(botName) is required." });
  }

  if (!chainId) {
    return res.status(400).json({ error: "Chain ID(chainId) is required." });
  }

  if (!address) {
    return res.status(400).json({ error: "Address is required." });
  }

  if (!uid) {
    return res.status(400).json({ error: "UID is required." });
  }

  try {
    const mintUrl = generateMintUrl({ botName, uid, txType, chainId, address });
    console.log(`Generated mint URL: ${mintUrl}`);
    res.json({ mintUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
