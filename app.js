import { sendTransactionUsingSmartAccount } from './smartAccountUtils.js';

const transaction = {
  to: "0x329Fb58Fe6706FB6945715287fbc39cFeC36654A",
  value: 100,
};

sendTransactionUsingSmartAccount(transaction);