import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";

const FeeInput = (props: {
  updateAmount: (amount: string) => void;
  updateIncludeFeeInAmount: (include: boolean) => void;
  includeFeeInAmount: boolean;
  feeAmount: number;
}) => {

  const [includeFeeInAmount, setIncludeFeeInAmount] = useState(false);

  return (
    <div className={s.feeDiv}>
      <div className={cn("form-field", s.amountInput)}>
        <span className="input-span">Fee:</span>
        <input
          className="input"
          type="number"
          step="any"
          onChange={(e) => { props.updateAmount(e.target.value ? Number(e.target.value) : '') }}
          placeholder="sat/Vb"
          value={props.feeAmount} />
      </div>
      <div className={s.includeFeeInAmountDiv}>
        <input type="checkbox" checked={props.includeFeeInAmount} onChange={() => {
          props.updateIncludeFeeInAmount(!includeFeeInAmount);
          setIncludeFeeInAmount(!includeFeeInAmount);
        }} />
        <span className={s.includeFeeSpan}>Include fee in the amount</span>
      </div>
    </div>
  );
};

export default FeeInput;
