import cn from "classnames";
import { FC, useEffect, useState } from "react";
import s from "./styles.module.scss";

interface Props {
  onChange: (value: number) => void;
  value: number;
}

const FeeInput: FC<Props> = ({ onChange, value }) => {
  const [selected, setSelected] = useState<1 | 2 | 3>(value === 1 || value === 2 ? value : 3);

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
          <FeeCard
            key={i.value}
            description={i.description}
            title={i.title}
            onSelect={() => setSelected(i.value as typeof selected)}
            selected={i.value === selected}
          />
        ))}
      </div>
      <input
        className={cn("input", { hidden: selected !== 3 })}
        placeholder="tid/Vb"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};

interface FeeCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
}

const FeeCard: FC<FeeCardProps> = ({ selected, onSelect, title, description }) => {
  return (
    <div className={cn(s.card, { [s.cardSelected]: selected })} onClick={onSelect}>
      <div className={s.title}>{title}</div>
      {description ? <div className={s.description}>{description}</div> : ""}
    </div>
  );
};

export default FeeInput;
