import { Request, Response } from "express";
import { generateSignatureTransactionJson } from "../../../utils";

export function signatureTransactionRouteHandler(req: Request, res: Response) {
  const {
    domainName,
    chainId,
    verifyingContract,
    owner,
    spender,
    value,
    nonce,
    deadline,
  } = req.body;

  const { uid } = req.params;

  if (!domainName) {
    return res
      .status(400)
      .json({ error: "Domain name(domainName) is required." });
  }

  if (!chainId) {
    return res.status(400).json({ error: "Chain ID(chainId) is required." });
  }

  if (!verifyingContract) {
    return res
      .status(400)
      .json({ error: "Verifying contract(verifyingContract) is required." });
  }

  if (!owner) {
    return res.status(400).json({ error: "Owner is required." });
  }

  if (!spender) {
    return res.status(400).json({ error: "Spender is required." });
  }

  if (!value) {
    return res.status(400).json({ error: "Value is required." });
  }

  if (!nonce) {
    return res.status(400).json({ error: "Nonce is required." });
  }

  if (!deadline) {
    return res.status(400).json({ error: "Deadline is required." });
  }

  try {
    const transactionJson = generateSignatureTransactionJson({
      domainName,
      chainId,
      verifyingContract,
      owner,
      spender,
      value,
      nonce,
      deadline,
    });

    res.json(transactionJson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
