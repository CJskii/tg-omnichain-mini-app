import { Request, Response } from "express";

import { generateApproveTransactionJson } from "../../../utils";

export function approveTransactionRouteHandler(req: Request, res: Response) {
  const { chainId, address, spenderAddress } = req.body;
  const { uid } = req.params;

  if (!chainId) {
    return res.status(400).json({ error: "Chain ID(chainId) is required." });
  }

  if (!address) {
    return res
      .status(400)
      .json({ error: "Contract Address(address) is required." });
  }

  if (!spenderAddress) {
    return res
      .status(400)
      .json({ error: "Spender Address(spenderAddress) is required." });
  }

  try {
    const transactionJson = generateApproveTransactionJson({
      chainId,
      address,
      spenderAddress,
    });

    res.json(transactionJson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
