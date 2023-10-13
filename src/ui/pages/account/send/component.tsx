import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import CreateSend from "./create-send";
import ConfirmSend from "./confirm-send";

export interface ISend {
  toAddress: string;
  fromAddress: string;
  amount: number;
  feeAmount: number;
  includeFeeInAmount: boolean;
  hex: string;
}

const Send = () => {

  const [transaction, setTransaction] = useState<undefined | ISend>(undefined);
  const [txId, setTxId] = useState<string | undefined>(undefined);

  const createTransaction = (transaction: ISend) => { setTransaction(transaction) }

  return (
    <div className={s.send}>
      {!txId ?
        <div className="w-full h-full">
          {!transaction ?
            <CreateSend createTransaction={createTransaction} /> :
            <ConfirmSend transaction={transaction} updateTxId={(txId) => setTxId(txId)} />}
        </div>
        :
        <div className={cn(s.finalle)}>

        </div>
      }
    </div>
  );
};

export default Send;
