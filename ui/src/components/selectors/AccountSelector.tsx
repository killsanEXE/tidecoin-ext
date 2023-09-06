import React from 'react'
import IAccount from 'shared/interfaces/IAccount'
import { useAppState } from 'shared/states/appState';

export default function AccountSelector() {

    const { exportedAccounts } = useAppState((v) => ({ exportedAccounts: v.exportedAccounts }))

    return (
        <select>
            {exportedAccounts.map(acc => <option>{acc.brandName}</option>)}
        </select>
    )
}