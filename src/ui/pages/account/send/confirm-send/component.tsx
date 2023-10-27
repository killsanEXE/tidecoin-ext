import { usePushTidecoinTxCallback } from "@/ui/hooks/transactions";
import s from "./styles.module.scss";
import cn from "classnames";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateAddressBook } from "@/ui/hooks/app";

const ConfirmSend = () => {
  const location = useLocation();
  const pushTx = usePushTidecoinTxCallback();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const updateAddressBook = useUpdateAddressBook();

  const confirmSend = async () => {
    setLoading(true);
    try {
      navigate(`/pages/finalle-send/${(await pushTx(location.state.hex))?.txid ?? ""}`);

      if (location.state.save) {
        await updateAddressBook(location.state.toAddress);
      }
    } catch (e) {
      toast.error(e);
      console.error(e);
    }
  };

  const fields = [
    {
      label: "To",
      value: location.state.toAddress,
    },
    {
      label: "From",
      value: location.state.fromAddress,
    },
    {
      label: "Amount",
      value: location.state.amount + " TDC",
    },
    {
      label: "Fee",
      value: `${location.state.feeAmount / 10 ** 8} TDC (${
        location.state.includeFeeInAmount ? "included" : "not included"
      })`,
    },
  ];

  return (
    <div className={s.wrapper}>
      {!loading ? (
        <div className={s.container}>
          <div className={s.container}>
            {fields.map((i) => (
              <div key={i.label} className={s.item}>
                <div className={s.label}>{i.label}:</div>
                <div className={s.input}>{i.value}</div>
              </div>
            ))}
          </div>
          <button className={cn("btn primary", s.confirmBtn)} onClick={confirmSend}>
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
