import React, { useEffect } from 'react'
import './Wallet.scss'
import AccountSelector from 'components/selectors/AccountSelector'

export default function Wallet(props: any) {

  return (
    <div className='wallet-div'>
      <div className='wallet-selector'>
        <AccountSelector />
      </div>
      <div className='wallet-selector'>
        <AccountSelector />
      </div>

    </div>
  )
}