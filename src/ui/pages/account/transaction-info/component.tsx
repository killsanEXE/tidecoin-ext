import { useParams } from "react-router-dom";
import s from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useControllersState } from "@/ui/states/controllerState";
import { ITransactionInfo } from "@/shared/interfaces/apiController";
import ReactLoading from "react-loading";
import { browserTabsCreate } from "@/shared/utils/browser";

const TransactionInfo = () => {
  const { txId } = useParams();
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));

  const [transaction, setTransaction] = useState<ITransactionInfo | undefined>(
    undefined
  );

  useEffect(() => {
    const updateTransaction = async () => {
      setTransaction(await apiController.getTransactionInfo(txId ?? ""));
    };

    if (!transaction) updateTransaction();
  }, [transaction, apiController]);

  return (
    <div className={s.transactionInfoDiv}>
      {transaction ? (
        <div className={s.transaction}>
          <div className={s.group}>
            <p className={s.transactionP}>TxId:</p>

            <span>{transaction.txid}</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Confirmations:</p>
            <span>{transaction.confirmations}</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Fee:</p>
            <span>{transaction.fee / 10 ** 8}</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Value:</p>
            <span>{transaction.value / 10 ** 8} TDC</span>
          </div>
          <button
            className={s.explorerBtn}
            onClick={() => {
              browserTabsCreate({
                url: `https://explorer.tidecoin.org/tx/${transaction.txid}`,
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
