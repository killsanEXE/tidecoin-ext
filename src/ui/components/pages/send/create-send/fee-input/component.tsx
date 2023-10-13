import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";

const FeeInput = (props: {
  updateAmount: (amount: number) => void;
  updateIncludeFeeInAmount: (include: boolean) => void;
}) => {

  const [includeFeeInAmount, setIncludeFeeInAmount] = useState(false);

  return (
    <div className={s.feeDiv}>
      <div className={cn("form-field", s.amountInput)}>
        <span className="input-span">Fee:</span>
        <input
          className="input"
          type="number"
          onChange={(e) => { props.updateAmount(Number.parseFloat(e.target.value)) }}
          placeholder="0.01" />
      </div>
      <div className={s.includeFeeInAmountDiv}>
        <input type="checkbox" onChange={() => {
          setIncludeFeeInAmount(!includeFeeInAmount);
          props.updateIncludeFeeInAmount(includeFeeInAmount);
        }} />
        <span className={s.includeFeeSpan}>Include fee in the amount</span>
      </div>
    </div>
  );
};

export default FeeInput;
