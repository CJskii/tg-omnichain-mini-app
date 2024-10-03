export const buildRequestBody = ({
  operationType,
  uid,
  chainId,
  address,
  spenderAddress,
  setSchemaError,
}: {
  operationType: string;
  uid: string;
  chainId?: number;
  address?: string;
  spenderAddress?: string;
  setSchemaError: (error: string) => void;
}) => {
  const requestBody: any = {};
  // TODO: Make chainId, address, and spenderAddress required fields
  // TODO: This has to be in the request as schema is failing when removed from here

  switch (operationType) {
    case "mint":
      requestBody.chainId = chainId;
      requestBody.address = address;
      break;
    case "approve":
      requestBody.chainId = chainId || 324;
      requestBody.address =
        address || "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C";
      requestBody.spenderAddress =
        spenderAddress || "0x4a89caAE3daf3Ec08823479dD2389cE34f0E6c96";
      break;
    case "signature":
      break;
    default:
      setSchemaError("Invalid transaction type.");
      return { apiUrl: "", requestBody: null };
  }

  return { requestBody };
};
