import { useWalletState } from "shared/states/walletState"
import "./SwitchAccountComponent.scss"
import CheckIcon from "components/icons/Checkicon"
import { useFetcher, useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowLeft from "components/icons/ArrowLeft";
import { useEffect, useState } from "react";
import PlusInCircleIcon from "components/icons/PlusInCirlceIcon";
import SmallMenuicon from "components/icons/SmallMenuIcon";
import CopyIcon from "components/icons/CopyIcon";
import KeyIcon from "components/icons/KeyIcon";
import TagIcon from "components/icons/TagIcon";
import XMarkIcon from "components/icons/XMarkIcon";

export default function SwitchAccountComponent() {
    const [selected, setSelected] = useState<number>()

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
                    <div className="main-acc" key={i}>
                        <div className="account">
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
                                <button className="manage-acc-button" onClick={() => { setSelected(i) }}><SmallMenuicon /></button>
                            </div>
                        </div>
                        <div className={`acc-settings hidden ${selected === i ? 'active' : ''}`}>
                            <div className="acc-setting copy"><CopyIcon /></div>
                            <div className="devider"></div>
                            <div className="acc-setting rename"><TagIcon /></div>
                            <div className="devider"></div>
                            <div className="acc-setting"><KeyIcon /></div>
                            <div className="devider"></div>
                            <div className="acc-setting" onClick={() => { setSelected(undefined) }}><XMarkIcon /></div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}