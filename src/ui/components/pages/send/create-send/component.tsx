import { useCreateTidecoinTxCallback } from "@/ui/hooks/transactions";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import FeeInput from "./fee-input";
import { ISend } from "../component";
import toast from "react-hot-toast";

const CreateSend = (props: {
  createTransaction: (transaction: ISend) => void;
}) => {

  const [addres, setAddres] = useState("");
  const [amount, setAmount] = useState(0);
  const currentAccount = useGetCurrentAccount();
  const sendTdc = useCreateTidecoinTxCallback();
  const [feeAmount, setFeeAmount] = useState(0);
  const [includeFeeInAmount, setIncludeFeeInAmount] = useState(false);

  const send = async () => {
    if (amount) {
      toast.error("AMOUNT")
    } else {
      const hex = await sendTdc(addres, amount * 10 ** 8, feeAmount, includeFeeInAmount);
      props.createTransaction({
        toAddress: addres,
        amount,
        feeAmount,
        includeFeeInAmount,
        fromAddress: currentAccount?.address ?? "",
        hex
      })
    }

  };

  return (
    <form className={cn("form", s.send)} onSubmit={(e) => e.preventDefault()}>
      <div className={s.inputs}>
        <div className="form-field">
          <span className="input-span">Address</span>
          <input
            placeholder={`${currentAccount!.address?.slice(0, 15)}...`}
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
              setAmount(Number.parseFloat(e.target.value));
            }}
          />
          <span className="input-info">
            MAX AMOUNT: {currentAccount!.balance}
          </span>
        </div>
      </div>

      <FeeInput updateAmount={(feeAmount) => { setFeeAmount(feeAmount) }} updateIncludeFeeInAmount={(include) => setIncludeFeeInAmount(include)} />

      <button className={cn(s.sendBtn, "btn primary")} onClick={send}>
        Continue
      </button>
    </form>
  );
};

export default CreateSend;
