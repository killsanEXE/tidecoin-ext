import { browserTabsCreate } from "@/shared/utils/browser";
import s from "./styles.module.scss";
import { useAppState } from "@/ui/states/appState";

import { UserIcon, KeyIcon, ArrowsPointingOutIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import Tile from "@/ui/components/tile";
import { TileProps } from "@/ui/components/tile/component";

import config from "../../../../../package.json";

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

  const items: TileProps[] = [
    {
      icon: <UserIcon className={ICON_CN} />,
      label: "Address type",
      link: "/pages/change-addr-type",
    },
    {
      icon: <KeyIcon className={ICON_CN} />,
      label: "Change password",
      link: "/pages/change-password",
    },
    {
      icon: <ArrowsPointingOutIcon className={ICON_CN} />,
      label: "Expand view",
      onClick: expandView,
    },
    {
      icon: <ArrowLeftOnRectangleIcon className={ICON_CN} />,
      label: "Logout",
      onClick: logout,
    },
  ];

  return (
    <div className={s.wrapper}>
      <div className={s.settings}>
        {items.map((i) => (
          <Tile key={i.label} {...i} />
        ))}
      </div>
      <div className={s.version}>
        Version <span>{config.version}</span>
      </div>
    </div>
  );
};

export default Settings;
