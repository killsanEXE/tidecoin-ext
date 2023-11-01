import { ConnectedSite } from "@/background/services/permission";
import { useControllersState } from "@/ui/states/controllerState";
import { useCallback, useEffect, useState } from "react";
import s from "./styles.module.scss";
import { XMarkIcon } from "@heroicons/react/24/solid";

const ConnectedSites = () => {

  const [connectedSites, setConnectedSites] = useState<ConnectedSite[]>([]);
  const { notificationController } = useControllersState((v) => ({
    notificationController: v.notificationController
  }));

  const getSites = useCallback(async () => {
    setConnectedSites(await notificationController.getConnectedSites());
  }, [notificationController, setConnectedSites])

  useEffect(() => {
    getSites();
  }, [getSites])

  const niceUrl = (url: string) => {
    if (url.includes("http://")) return url.replace("http://", "");
    return url.replace("https://", "");
  }

  const removeSite = async (origin: string) => {
    console.log('YES')
    await notificationController.removeSite(origin)
    const toDelete = connectedSites.find(f => f.origin === origin);
    setConnectedSites(connectedSites.splice(connectedSites.indexOf(toDelete), 1))
  }

  return (
    <>
      {connectedSites.length > 0 ?
        <div className={s.sites}>
          {connectedSites.map((f, i) =>
            <div key={i} className={s.site}>
              <p>{niceUrl(f.origin)}</p>
              <XMarkIcon className={s.icon} onClick={() => { removeSite(f.origin) }} />
            </div>
          )}
        </div>
        :
        <p>You didn't connect any sites to your wallet yet</p>
      }
    </>
  );
};

export default ConnectedSites;
