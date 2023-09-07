import React, { Fragment, useEffect, useState } from 'react'
import IAccount from 'shared/interfaces/IAccount'
import { useAppState } from 'shared/states/appState';
import "./Selector.scss";
import { Listbox, Transition } from '@headlessui/react';

export default function AccountSelector() {

    const { exportedAccounts } = useAppState((v) => ({ exportedAccounts: v.exportedAccounts }))
    const [selected, setSelected] = useState(exportedAccounts[0]);

    useEffect(() => {
    }, [])

    return (
        <div className="select-div">
            <Listbox value={selected} onChange={setSelected}>
                <Listbox.Button className="select-button">{selected.brandName ?? `Account ${exportedAccounts.indexOf(selected) + 1}`}</Listbox.Button>
                <Listbox.Options>
                    {exportedAccounts.map((account, i) => (
                        <Listbox.Option
                            key={i}
                            value={account}
                        // disabled={account}
                        >
                            {selected.brandName ?? `Account ${exportedAccounts.indexOf(selected) + 1}`}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </div>
    )
}