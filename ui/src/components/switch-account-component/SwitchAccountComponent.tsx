import { useWalletState } from "shared/states/walletState"
import "./SwitchAccountComponent.scss"
import CheckIcon from "components/icons/Checkicon"
import { useFetcher, useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowLeft from "components/icons/ArrowLeft";
import { useEffect, useState } from "react";
import PlusInCircleIcon from "components/icons/PlusInCirlceIcon";
import SmallMenuicon from "components/icons/SmallMenuIcon";

export default function SwitchAccountComponent() {

    const navigate = useNavigate();
    const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))

    return (
        <div className="switch-acc-div">
            <div className="control-div">
                <p className="control-elem back" onClick={() => { navigate(-1) }}><ArrowLeft /> Back</p>
                <p className="control-elem">Switch account</p>
                <p className="control-elem add-new" onClick={() => {
                    navigate("/create-new-account")
                }}><PlusInCircleIcon /></p>
            </div>
            <div className="accounts">
                {currentWallet?.accounts.map((acc, i) =>
                    <div className="account" key={i}>
                        <div className="acc-info">
                            <div className="name">
                                {currentWallet.currentAccount.address === acc.address ? <CheckIcon /> : undefined}
                                {acc.brandName}
                            </div>
                            <div className="address">
                                {acc.address}
                            </div>
                        </div>
                        <div className="acc-control">
                            <button className="manage-acc-button"><SmallMenuicon /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}