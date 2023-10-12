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
          navigate("/home/wallet");
        }}
      >
        <WalletIcon />
      </button>
      <button
        className={s.navBtn}
        onClick={() => {
          navigate("/home/settings");
        }}
      >
        <Cog6ToothIcon />
      </button>
    </div>
  );
};

export default Nav;
