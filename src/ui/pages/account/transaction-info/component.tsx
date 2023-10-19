import s from "./styles.module.scss";
import ReactLoading from "react-loading";
import { browserTabsCreate } from "@/shared/utils/browser";
import { useLocation } from "react-router-dom";
import { ITransaction } from "@/shared/interfaces/apiController";
import { getTransactionValue } from "@/ui/utils/transactions";
import { useGetCurrentAccount } from "@/ui/states/walletState";

const TransactionInfo = () => {
  const currentAccount = useGetCurrentAccount();

  const {
    state: { transaction, lastBlock },
  } = useLocation();
  const tx = transaction as ITransaction;

  return (
    <div className={s.transactionInfoDiv}>
      {transaction ? (
        <div className={s.transaction}>
          <div className={s.group}>
            <p className={s.transactionP}>TxId:</p>

            <span>{tx.txid}</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Confirmations:</p>
            <span>{lastBlock - tx.status.block_height}</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Fee:</p>
            <span>{tx.fee / 10 ** 8} TDC</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Value:</p>
            <span>{getTransactionValue(tx, currentAccount?.address)} TDC</span>
          </div>
          <button
            className={s.explorerBtn}
            onClick={async () => {
              await browserTabsCreate({
                url: `https://explorer.tidecoin.org/tx/${transaction.txid}`,
                active: true,
              });
            }}
          >
            Open in explorer
          </button>
        </div>
      ) : (
        <ReactLoading type="spin" color="#fff" />
      )}
    </div>
  );
};

export default TransactionInfo;
