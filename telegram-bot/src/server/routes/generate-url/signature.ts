import { Request, Response } from "express";
import { generateSignatureUrl } from "../../../utils";

export function signatureRouteHandler(req: Request, res: Response) {
  const { botName, uid, txType } = req.body;

  if (!botName) {
    return res.status(400).json({ error: "Bot name(botName) is required." });
  }

  if (!uid) {
    return res.status(400).json({ error: "UID(uid) is required." });
  }

  if (!txType) {
    return res
      .status(400)
      .json({ error: "Transaction type(txType) is required." });
  }

  try {
    const signatureUrl = generateSignatureUrl({ botName, uid, txType });
    console.log(`Generated signature URL: ${signatureUrl}`);
    res.json({ signatureUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
