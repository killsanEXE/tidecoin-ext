import { Link, useParams } from "react-router-dom";
import s from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useControllersState } from "@/ui/states/controllerState";
import { ITransactionInfo } from "@/shared/interfaces/apiController";
import ReactLoading from "react-loading";

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
          <p className={s.transactionP}>TxId: <Link to={`https://explorer.tidecoin.org/tx/${transaction.txid}`}>{transaction.txid}</Link></p>
          <p className={s.transactionP}>
            Confirmations: {transaction.confirmations}
          </p>
          <p className={s.transactionP}>Fee: {transaction.fee / 10 ** 8}</p>
          <p className={s.transactionP}>
            Value: {transaction.value / 10 ** 8} TDC
          </p>
        </div>
      ) : (
        <ReactLoading type="spin" color="#fff" />
      )}
    </div>
  );
};

export default TransactionInfo;
