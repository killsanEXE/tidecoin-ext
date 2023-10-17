import s from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { WalletIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const Nav = () => {
  const navigate = useNavigate();

  return (
    <div className={s.mainNav}>
      <button
        className={s.navBtn}
        onClick={() => {
          navigate("/home");
        }}
      >
        <WalletIcon className="w-8 h-8" />
      </button>
      <button
        className={s.navBtn}
        onClick={() => {
          navigate("/pages/settings");
        }}
      >
        <Cog6ToothIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Nav;
