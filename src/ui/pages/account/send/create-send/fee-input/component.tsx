import cn from "classnames";
import { FC, useEffect, useState } from "react";
import s from "./styles.module.scss";
import { Switch } from "@headlessui/react";

interface Props {
  onChange: (value: number) => void;
  onIncludeChange: (value: boolean) => void;
  includeFeeValue: boolean;
  includeFeeLocked: boolean;
}

const FeeInput: FC<Props> = ({
  onChange,
  onIncludeChange,
  includeFeeValue,
  includeFeeLocked,
}) => {
  const [selected, setSelected] = useState<1 | 2 | 3>(1);

  const cards = [
    {
      title: "Slow",
      description: "1 sat/Vb",
      value: 1,
    },
    {
      title: "Fast",
      description: "2 sat/Vb",
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
            {i.description ? (
              <div className={s.description}>{i.description}</div>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <input
        className={cn("input", { hidden: selected !== 3 })}
        placeholder="sat/Vb"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <Switch.Group>
        <div
          className={cn("flex gap-2 items-center mt-4", {
            [s.locked]: includeFeeLocked,
          })}
        >
          <Switch
            checked={includeFeeValue}
            onChange={(v) => {
              if (includeFeeLocked) return;
              onIncludeChange(v);
            }}
            className={`${includeFeeValue ? "bg-teal-600" : "bg-gray-500"}
          relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span
              aria-hidden="true"
              className={`${includeFeeValue ? "translate-x-6" : "translate-x-0"}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <Switch.Label className="mr-4 cursor-pointer">
            Include fee in the amount
          </Switch.Label>
        </div>
      </Switch.Group>
    </div>
  );
};

export default FeeInput;
