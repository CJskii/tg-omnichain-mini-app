import { Request, Response } from "express";
import { generateMintTransactionJson } from "../../../utils";

export function mintTransactionRouteHandler(req: Request, res: Response) {
  const { chainId, address } = req.body;

  const { uid } = req.params;

  if (!chainId) {
    return res.status(400).json({ error: "Chain ID(chainId) is required." });
  }

  if (!address) {
    return res
      .status(400)
      .json({ error: "Contract Address(address) is required." });
  }

  try {
    const transactionJson = generateMintTransactionJson({
      chainId,
      address,
    });

    res.json(transactionJson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
