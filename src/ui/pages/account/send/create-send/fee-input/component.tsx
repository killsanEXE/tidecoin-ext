import cn from "classnames";
import { FC, useEffect, useState } from "react";
import s from "./styles.module.scss";
import Switch from "@/ui/components/switch";

interface Props {
  onChange: (value: number) => void;
  onIncludeChange: (value: boolean) => void;
  includeFeeValue: boolean;
  includeFeeLocked: boolean;
}

const FeeInput: FC<Props> = ({ onChange, onIncludeChange, includeFeeValue, includeFeeLocked }) => {
  const [selected, setSelected] = useState<1 | 2 | 3>(1);

  const cards = [
    {
      title: "Slow",
      description: "1 tid/Vb",
      value: 1,
    },
    {
      title: "Fast",
      description: "2 tid/Vb",
      value: 2,
    },
    {
      title: "Custom",
      value: 3,
    },
  ];

  useEffect(() => {
    if (selected !== 3) {
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <div className={s.container}>
      <div className={s.cardWrapper}>
        {cards.map((i) => (
          <div
            className={cn(s.card, { [s.cardSelected]: i.value === selected })}
            key={i.value}
            onClick={() => setSelected(i.value as typeof selected)}
          >
            <div className={s.title}>{i.title}</div>
            {i.description ? <div className={s.description}>{i.description}</div> : ""}
          </div>
        ))}
      </div>
      <input
        className={cn("input", { hidden: selected !== 3 })}
        placeholder="tid/Vb"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <Switch
        label="Include fee in the amount"
        onChange={onIncludeChange}
        value={includeFeeValue}
        locked={includeFeeLocked}
      />
    </div>
  );
};

export default FeeInput;
