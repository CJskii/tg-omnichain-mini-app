import { Request, Response } from "express";
import { generateApproveUrl } from "../../../utils";

export function approveRouteHandler(req: Request, res: Response) {
  const { botName, txType, uid, chainId, address, spenderAddress } = req.body;

  if (!botName) {
    return res.status(400).json({ error: "Bot name(botName) is required." });
  }

  if (!txType) {
    return res
      .status(400)
      .json({ error: "Transaction type(txType) is required." });
  }

  if (!uid) {
    return res.status(400).json({ error: "UID(uid) is required." });
  }

  if (!chainId) {
    return res.status(400).json({ error: "Chain ID(chainId) is required." });
  }

  if (!address) {
    return res.status(400).json({ error: "Address is required." });
  }

  if (!spenderAddress) {
    return res
      .status(400)
      .json({ error: "Spender address(spenderAddress) is required." });
  }

  try {
    const approveUrl = generateApproveUrl({
      botName,
      txType,
      uid,
      chainId,
      address,
      spenderAddress,
    });

    console.log(`Generated approve URL: ${approveUrl}`);

    res.status(200).json({ approveUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
