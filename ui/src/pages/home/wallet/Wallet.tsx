import './Wallet.scss'
import { useWalletState } from 'shared/states/walletState'

export default function Wallet() {

  const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))

  return (
    <div className='wallet-div'>
      <div className='change-wallet-acc-div'>
        <button className='change btn primary'>{currentWallet?.name}</button>
        <button className='change btn secondary'>{currentWallet?.currentAccount.brandName}</button>
      </div>

      <div className="acc-info">

      </div>
    </div>
  )
}