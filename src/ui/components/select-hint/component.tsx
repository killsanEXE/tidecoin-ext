import { Combobox, Transition } from "@headlessui/react";
import { FC, Fragment, useState } from "react";
import { englishWords } from "test-test-test-hd-wallet";
import cn from "classnames";

import s from "./styles.module.scss";

export interface Props {
  selected?: number;
  setSelected: (value: number | string) => void;
}

const SelectWithHint: FC<Props> = ({ selected, setSelected }) => {
  const [query, setQuery] = useState("");

  const filteredWords =
    query === ""
      ? []
      : englishWords
        .map((i, idx) => [i, idx] as [string, number])
        .filter(([word, idx]) =>
          word.startsWith(query.toLowerCase().replace(/\s+/g, ""))
        )
        .slice(0, 4);

  return (
    <Combobox value={selected} onChange={setSelected} nullable={true}>
      <div className="relative">
        <div className={s.inputBox}>
          <Combobox.Input
            className={s.input}
            displayValue={(word: string) => word}
            onChange={(event) => {
              const phrase = event.target.value as string;
              if (phrase.trim().split(" ").length === 12) {
                setSelected(phrase.trim());
              } else setQuery(phrase)
            }}
            value={selected}
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className={s.optionsBox}>
            {filteredWords.length === 0 && query !== "" ? (
              <div className={s.optionsNotFound}>Nothing found.</div>
            ) : (
              filteredWords.map((word) => (
                <Combobox.Option
                  key={word[1]}
                  className={({ active }) =>
                    cn(s.options, { [s.optionsActive]: active })
                  }
                  value={word[0]}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"
                          }`}
                      >
                        {word[0]}
                      </span>
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default SelectWithHint;
