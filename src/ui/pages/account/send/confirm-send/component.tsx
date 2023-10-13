import { usePushTidecoinTxCallback } from "@/ui/hooks/transactions";
import { ISend } from "../component";
import s from "./styles.module.scss";
import cn from "classnames";
import { useState } from "react";

const ConfirmSend = (props: { transaction: ISend, updateTxId: (txId: string) => void }) => {

  const pushTx = usePushTidecoinTxCallback();
  const [loading, setLoading] = useState(false);
  const confirmSend = async () => {
    props.updateTxId((await pushTx(props.transaction.hex))?.txId ?? "")
  }

  return (
    <div className={s.confirmSend}>
      {!loading ?
        <div>
          <div className={s.transactionInfo}>
            <p className={s.info}>To: {props.transaction.toAddress}</p>
            <p className={s.info}>From: {props.transaction.fromAddress}</p>
            <p className={s.info}>Amount: {props.transaction.amount}</p>
            <p className={s.info}>Fee: {props.transaction.feeAmount}</p>
            <p className={s.info}>Fee is {props.transaction.includeFeeInAmount ? "not" : ""} included in the amount</p>
          </div>
          <button className="btn" onClick={confirmSend}>Confirm</button>
        </div>
        :
        <div></div>}
    </div>
  );
};

export default ConfirmSend;
