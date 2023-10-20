import s from "./styles.module.scss";
import { Link } from "react-router-dom";
import { WalletIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const Nav = () => {
  return (
    <div className={s.mainNav}>
      <Link className={s.navBtn} to={"/home"}>
        <WalletIcon className="w-8 h-8" />
      </Link>
      <Link className={s.navBtn} to={"/pages/settings"}>
        <Cog6ToothIcon className="w-8 h-8" />
      </Link>
    </div>
  );
};

export default Nav;
