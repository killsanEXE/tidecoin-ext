import { usePushTidecoinTxCallback } from "@/ui/hooks/transactions";
import s from "./styles.module.scss";
import cn from "classnames";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateAddressBook } from "@/ui/hooks/app";

const ConfirmSend = () => {
  const location = useLocation();
  const pushTx = usePushTidecoinTxCallback();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const updateAddressBook = useUpdateAddressBook();

  const confirmSend = async () => {
    setLoading(true);
    await updateAddressBook(location.state.toAddress);
    try {
      navigate(
        `/pages/finalle-send/${(await pushTx(location.state.hex))?.txid ?? ""}`
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={cn(
        s.confirmSend,
        "w-full h-full py-[1rem] flex items-center justify-center"
      )}
    >
      {!loading ? (
        <div className="w-full h-full flex flex-col justify-between items-center">
          <div
            className={cn(
              s.transactionInfo,
              "w-[95%] flex flex-col items-center py-[1rem] gap-[1rem]"
            )}
          >
            <p className={s.info}>To: {location.state.toAddress}</p>
            <p className={s.info}>From: {location.state.fromAddress}</p>
            <p className={s.info}>Amount: {location.state.amount}</p>
            <p className={s.info}>Fee: {location.state.feeAmount}</p>
            <p className={s.info}>
              Fee is {location.state.includeFeeInAmount ? "" : "not"} included
              in the amount
            </p>
          </div>
          <button
            className={cn("btn primary", s.confirmBtn)}
            onClick={confirmSend}
          >
            Confirm
          </button>
        </div>
      ) : (
        <ReactLoading type="spin" color="#ffbc42" />
      )}
    </div>
  );
};

export default ConfirmSend;
