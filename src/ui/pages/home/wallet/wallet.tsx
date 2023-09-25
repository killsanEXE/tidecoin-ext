import { useNavigate } from 'react-router-dom'
import CopyIcon from '@/ui/components/icons/CopyIcon';
import ReceiveIcon from '@/ui/components/icons/ReceiveIcon';
import SendIcon from '@/ui/components/icons/SendIcon';
import s from "./styles.module.scss";
import { copyToClipboard, shortAddress } from '@/ui/utils';
import toast from 'react-hot-toast';
import { useWalletState } from '@/ui/states/walletState';
import cn from "classnames";

const Wallet = () => {

  const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))
  const navigate = useNavigate();

  return (
    <div className={s.walletDiv}>
      <div className={s.changeWalletAccDiv}>
        <button className={cn(s.change, s.btn, 'bg-primary')}>{currentWallet?.name ?? "wallet"}</button>
        <button
          onClick={() => {
            navigate("/pages/switch-account")
          }}
          className={cn(s.change, s.btn)}>
          {currentWallet?.currentAccount.name}
        </button>
      </div>

      <div className={cn(s.accPanel, s.center)}>
        <p className={cn(s.balance, s.center)}>{currentWallet?.currentAccount.balance} TDC</p>
        <p className={cn(s.accPubAddress, s.center)} onClick={() => {
          copyToClipboard(currentWallet?.currentAccount.address).then(() => {
            toast.success("Copied", {
              style: { borderRadius: 0 },
              iconTheme: {
                primary: '#ffbc42',
                secondary: '#766c7f'
              }
            })
          })
        }}><CopyIcon/> {shortAddress(currentWallet?.currentAccount.address)}</p>

        <div className={cn(s.receiveSendBtns, s.center)}>
          <button className={cn(s.btn, s.center)}><ReceiveIcon/> Receive</button>
          <button className={cn(s.btn, s.center)}><SendIcon/> Send</button>
        </div>
      </div>

      <p className={s.transactions}>Transactions</p>
    </div>
  )
}

export default Wallet