import { useNavigate } from 'react-router-dom'
import CopyIcon from '@/ui/components/icons/CopyIcon';
import ReceiveIcon from '@/ui/components/icons/ReceiveIcon';
import SendIcon from '@/ui/components/icons/SendIcon';
import { useWalletState } from '@/ui/shared/states/walletState';
import "./Wallet.scss";

export default function Wallet() {

  const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))
  const navigate = useNavigate();

  return (
    <div className='wallet-div'>
      <div className='change-wallet-acc-div'>
        <button className='change btn primary'>{currentWallet?.name}</button>
        <button
          onClick={() => {
            navigate("/switch-account")
          }}
          className='change btn'>
          {currentWallet?.currentAccount.name}
        </button>
      </div>

      <div className="acc-panel flex-center-center">
        <p className='balance flex-center-center'>{currentWallet?.currentAccount.balance} TDC</p>
        <p className='acc-pub-address flex-center-center'><CopyIcon /> {currentWallet?.currentAccount.name}</p>

        <div className="receive-send-btns flex-center-center">
          <button className="btn flex-center-center"><ReceiveIcon /> Receive</button>
          <button className="btn flex-center-center"><SendIcon /> Send</button>
        </div>
      </div>

      <div className="transactions-div">
        <p>transactions: </p>
      </div>
    </div>
  )
}