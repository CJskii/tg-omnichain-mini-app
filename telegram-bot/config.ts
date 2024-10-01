interface queryParams {
  botName: string; // name of telegram bot - passed as query parameter from backend to frontend
  txType: txType; // type of the transaction - logic for this is in the frontend
  uid: string; // telegram chat id - passed as query parameter from backend to frontend
  source: string; // url to json object that describes the type of operation - this should be dynamically generated for our inputs and provided when we initiate call from the frontend to web3 wallet bridge
  callback: string; // url to callback function - this should be on our side to receive update if the transaction is successful or not
}

enum txType {
  transaction = "transaction",
  signature = "signature",
}

const config = () => {
  const botName = "OmniTransferBot";
  const txType = "";
};
