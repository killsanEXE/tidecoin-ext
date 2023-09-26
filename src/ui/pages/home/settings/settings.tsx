import LinkIcon from "@/ui/components/icons/LinkIcon";
import s from "./styles.module.scss";
import { useAppState } from "@/ui/states/appState";

const Settings = () => {

  const { logout } = useAppState((v) => ({
    logout: v.logout
  }))

  return (
    <div className={s.settings}>
      <div className={s.card}>
        <div className={s.cardText}>
          Change Password
        </div>
        <LinkIcon />
      </div>
      <div className={s.card} onClick={logout}>
        <div className={s.cardText}>
          Logout
        </div>
        <LinkIcon />
      </div>
    </div>
  )
}

export default Settings