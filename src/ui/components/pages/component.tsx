import { Outlet, useLocation, useNavigate } from "react-router-dom";
import s from "./styles.module.scss";
import cn from "classnames";
import ArrowLeft from "@/ui/components/icons/ArrowLeft";
import PlusInCircleIcon from "@/ui/components/icons/PlusInCirlceIcon";
import { useEffect } from "react";
import { useWalletState } from "@/ui/states/walletState";

export default function PagesLayout() {

    const routeTitles = {
        "/pages/switch-account": {
            "title": "Switch Account",
            "action": () => { navigate("/pages/create-new-account") },
        },
        "/pages/create-new-account": {
            "title": "Create New Account",
        },
        "/pages/change-password": {
            "title": "Change Password",
        },
        "/pages/receive": {
            "title": "Receive TDC",
        },
        "/pages/switch-wallet": {
            "title": "Switch Wallet",
            "action": () => { navigate("/pages/create-new-wallet") },
        },
        "/pages/create-new-wallet": {
            "title": "Create New Wallet"
        },
        "/pages/new-mnemonic": {
            "title": "Create New Wallet"
        },
        "/pages/restore-mnemonic": {
            "title": "Create New Wallet"
        },
        "/pages/restore-priv-key": {
            "title": "Create New Wallet"
        },
    }

    const { wallets } = useWalletState((v) => ({
        wallets: v.wallets
    }))

    const currentRoute = useLocation();
    const navigate = useNavigate();

    return (
        <div className={s.layout}>
            <div className={s.controlDiv}>
                {(wallets.size <= 0 && currentRoute.pathname === "/pages/create-new-wallet") ?
                    <p></p> :
                    <p
                        className={cn(s.controlElem, s.back)}
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        <ArrowLeft /> Back
                    </p>
                }
                <p className={s.controlElem}>{routeTitles[currentRoute.pathname]["title"]}</p>
                {
                    routeTitles[currentRoute.pathname]["action"] === undefined ? <p></p> :
                        <p
                            className={cn(s.controlElem, s.addNew)}
                            onClick={routeTitles[currentRoute.pathname]["action"]}
                        >
                            <PlusInCircleIcon />
                        </p>
                }
            </div>
            <div className={s.contentDiv}>
                <Outlet />
            </div>
        </div>
    )
}