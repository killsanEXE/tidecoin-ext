import LinkIcon from "@/ui/components/icons/LinkIcon";
import s from "./styles.module.scss";
import { useAppState } from "@/ui/states/appState";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { logout } = useAppState((v) => ({
    logout: v.logout,
  }));

  const navigate = useNavigate();

  return (
    <div className={s.settings}>
      <div
        className={s.card}
        onClick={() => {
          navigate("/pages/change-addr-type");
        }}
      >
        <div className={s.cardText}>Address Type</div>
        <LinkIcon />
      </div>
      <div
        className={s.card}
        onClick={() => {
          navigate("/pages/change-password");
        }}
      >
        <div className={s.cardText}>Change Password</div>
        <LinkIcon />
      </div>
      <div className={s.card} onClick={logout}>
        <div className={s.cardText}>Logout</div>
        <LinkIcon />
      </div>
    </div>
  );
};

export default Settings;
