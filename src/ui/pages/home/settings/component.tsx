import { browserTabsCreate } from "@/shared/utils/browser";
import s from "./styles.module.scss";
import { useAppState } from "@/ui/states/appState";
import { Link } from "react-router-dom";
import cn from "classnames";

import { UserIcon, KeyIcon, ArrowsPointingOutIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

const ICON_SIZE = 8;
const ICON_CN = `w-${ICON_SIZE} h-${ICON_SIZE}`;

const Settings = () => {
  const { logout } = useAppState((v) => ({
    logout: v.logout,
  }));

  const expandView = () => {
    browserTabsCreate({
      url: "index.html",
    });
  };

  return (
    <div className={s.settings}>
      <Link className={s.card} to={"/pages/change-addr-type"}>
        <UserIcon className={ICON_CN} />
        <div>Address Type</div>
      </Link>
      <Link className={s.card} to={"/pages/change-password"}>
        <KeyIcon className={ICON_CN} />
        <div>Change Password</div>
      </Link>
      <div className={cn(s.card, "md:hidden")} onClick={expandView}>
        <ArrowsPointingOutIcon className={ICON_CN} />
        <div>Expand view</div>
      </div>
      <div className={s.card} onClick={logout}>
        <ArrowLeftOnRectangleIcon className={ICON_CN} />
        <div>Logout</div>
      </div>
    </div>
  );
};

export default Settings;
