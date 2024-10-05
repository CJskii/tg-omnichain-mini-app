import { Request, Response } from "express";
import { generateBridgeTransactionJson } from "../../../utils/transactions/bridge";

export function bridgeTransactionRouteHandler(req: Request, res: Response) {
  const { chainId, address, remoteChainId, tokenId, ownerAddress } = req.body;

  const { uid } = req.params;

  if (!chainId) {
    return res.status(400).json({ error: "chainId is required" });
  }

  if (!address) {
    return res.status(400).json({ error: "address is required" });
  }

  if (!remoteChainId) {
    return res.status(400).json({ error: "remoteChainId is required" });
  }

  if (!tokenId) {
    return res.status(400).json({ error: "tokenId is required" });
  }

  try {
    const transactionJson = generateBridgeTransactionJson({
      chainId,
      address,
      ownerAddress,
      remoteChainId,
      tokenId,
    });

    res.json(transactionJson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
