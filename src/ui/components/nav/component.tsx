import s from './styles.module.scss';
import { useNavigate } from 'react-router-dom';
import WalletIcon from '@/ui/components/icons/WalletIcon';
import SettingsIcon from '@/ui/components/icons/SettingsIcon';


const Nav = () => {
  const navigate = useNavigate();

  return (
    <div className={s.mainNav}>
      <button className={s.navBtn} onClick={() => {
        navigate("/home/wallet")
      }}><WalletIcon/></button>
      <button className={s.navBtn} onClick={() => {
        navigate("/home/settings")
      }}><SettingsIcon/></button>
    </div>
  )
}

export default Nav