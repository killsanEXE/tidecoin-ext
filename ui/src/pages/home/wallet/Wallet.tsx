import React, { useEffect } from 'react'
import './Wallet.scss'
import { useWalletState } from 'shared/states/walletState'

export default function Wallet() {

  const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))


  return (
    <div className='wallet-div'>
      <div className='change-acc-div'>
        <button className='change-acc-btn'></button>
      </div>
    </div>
  )
}