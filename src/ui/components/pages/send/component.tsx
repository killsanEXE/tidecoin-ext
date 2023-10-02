import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import { useWalletState } from "@/ui/states/walletState";

const Send = () => {

  const [addres, setAddres] = useState("");
  const [amount, setAmount] = useState(0);
  const { currentWalet } = useWalletState((v) => ({ currentWalet: v.currentWallet }))

  const send = () => {

  }

  return (
    <form className={cn("form", s.send)} onSubmit={(e) => e.preventDefault()}>
      <div className={s.inputs}>
        <div className="form-field">
          <span className="input-span">Address</span>
          <input
            placeholder={currentWalet?.currentAccount.address}
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
            type="number"
            className="input"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
          <span className="input-info">MAX AMOUNT: {currentWalet?.currentAccount.balance}</span>
        </div>
      </div>

      <button className={cn(s.sendBtn, "btn primary")} onClick={send}>
        Send
      </button>
    </form>
  );
};

export default Send;
