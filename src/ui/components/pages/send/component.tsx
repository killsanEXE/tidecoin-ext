import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import {
  useCreateTidecoinTxCallback,
  usePushTidecoinTxCallback,
} from "@/ui/hooks/transactions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Send = () => {
  const [addres, setAddres] = useState("");
  const [amount, setAmount] = useState(0);
  const currentAccount = useGetCurrentAccount();
  const sendTdc = useCreateTidecoinTxCallback();
  const pushTx = usePushTidecoinTxCallback();
  const navigate = useNavigate();

  const send = async () => {
    const hex = await sendTdc(addres, amount * 10 ** 8, 1, true);
    await pushTx(hex);
    toast.success("Success!");
    navigate("/home/wallet");
  };

  return (
    <form className={cn("form", s.send)} onSubmit={(e) => e.preventDefault()}>
      <div className={s.inputs}>
        <div className="form-field">
          <span className="input-span">Address</span>
          <input
            placeholder={currentAccount!.address}
            type="text"
            className="input"
            onChange={(e) => {
              setAddres(e.target.value);
            }}
          />
        </div>
        <div className="form-field">
          <span className="input-span">Amount</span>
          <input
            placeholder="0"
            type="text"
            className="input"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
          <span className="input-info">
            MAX AMOUNT: {currentAccount!.balance}
          </span>
        </div>
      </div>

      <button className={cn(s.sendBtn, "btn primary")} onClick={send}>
        Send
      </button>
    </form>
  );
};

export default Send;
