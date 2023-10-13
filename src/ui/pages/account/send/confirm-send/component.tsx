import { usePushTidecoinTxCallback } from "@/ui/hooks/transactions";
import s from "./styles.module.scss";
import cn from "classnames";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useLocation } from "react-router-dom";

const ConfirmSend = () => {

  const state = useLocation();

  const pushTx = usePushTidecoinTxCallback();
  const [loading, setLoading] = useState(false);
  const confirmSend = async () => {
    setLoading(true);
    props.updateTxId((await pushTx(props.transaction.hex))?.txid ?? "")
  }

  return (
    <div className={cn(s.confirmSend, "w-full h-full py-[1rem] flex items-center justify-center")}>
      {!loading ?
        <div className="w-full h-full flex flex-col justify-between items-center">
          <div className={cn(s.transactionInfo, "w-[95%] flex flex-col items-center py-[1rem] gap-[1rem]")}>
            <p className={s.info}>To: {props.transaction.toAddress}</p>
            <p className={s.info}>From: {props.transaction.fromAddress}</p>
            <p className={s.info}>Amount: {props.transaction.amount}</p>
            <p className={s.info}>Fee: {props.transaction.feeAmount}</p>
            <p className={s.info}>Fee is {props.transaction.includeFeeInAmount ? "" : "not"} included in the amount</p>
          </div>
          <button className={cn("btn primary", s.confirmBtn)} onClick={confirmSend}>Confirm</button>
        </div>
        :
        <ReactLoading type="spin" color="#ffbc42" />}
    </div>
  );
};

export default ConfirmSend;
