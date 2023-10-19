import { Combobox, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useState } from "react";
import { englishWords } from "test-test-test-hd-wallet";
import cn from "classnames";

import s from "./styles.module.scss";

export interface Props {
  selected?: string;
  setSelected: (value: string) => void;
}

const SelectWithHint: FC<Props> = ({ selected, setSelected }) => {
  const [query, setQuery] = useState("");

  const filteredWords =
    query === ""
      ? []
      : englishWords.filter((word) => word.startsWith(query.toLowerCase().replace(/\s+/g, ""))).slice(0, 4);

  useEffect(() => {
    if (selected?.length) {
      setQuery(selected);
    }
  }, [selected, setQuery]);

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
              } else {
                setQuery(phrase);
                if (filteredWords[0] === phrase) {
                  setSelected(phrase);
                }
              }
            }}
            value={query}
          />
        </div>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Combobox.Options className={s.optionsBox}>
            {filteredWords.length === 0 && query !== "" ? (
              <div className={s.optionsNotFound}>Nothing found.</div>
            ) : (
              filteredWords.map((word) => (
                <Combobox.Option
                  key={word}
                  className={({ active }) => cn(s.options, { [s.optionsActive]: active })}
                  value={word}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{word}</span>
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
