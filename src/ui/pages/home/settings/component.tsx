import s from "./styles.module.scss";
import { useAppState } from "@/ui/states/appState";
import { Link } from "react-router-dom";

const Settings = () => {
  const { logout } = useAppState((v) => ({
    logout: v.logout,
  }));

  return (
    <div className={s.settings}>
      <Link className={s.card} to={"/pages/change-addr-type"}>
        <div className={s.cardText}>Address Type</div>
      </Link>
      <Link className={s.card} to={"/pages/change-password"}>
        <div className={s.cardText}>Change Password</div>
      </Link>
      <div className={s.card} onClick={logout}>
        <div className={s.cardText}>Logout</div>
      </div>
    </div>
  );
};

export default Settings;
