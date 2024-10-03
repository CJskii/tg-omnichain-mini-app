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

  switch (operationType) {
    case "mint":
      requestBody.chainId = chainId;
      requestBody.address = address;
      break;
    case "approve":
      requestBody.chainId = chainId;
      requestBody.address = address;
      requestBody.spenderAddress = spenderAddress;
      break;
    case "signature":
      break;
    default:
      setSchemaError("Invalid transaction type.");
      return { apiUrl: "", requestBody: null };
  }

  return { requestBody };
};
