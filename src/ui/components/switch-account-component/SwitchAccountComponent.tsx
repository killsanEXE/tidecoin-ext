import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "../icons/ArrowLeft";
import CheckIcon from "../icons/Checkicon";
import CopyIcon from "../icons/CopyIcon";
import KeyIcon from "../icons/KeyIcon";
import PlusInCircleIcon from "../icons/PlusInCirlceIcon";
import SmallMenuicon from "../icons/SmallMenuIcon";
import TagIcon from "../icons/TagIcon";
import XMarkIcon from "../icons/XMarkIcon";
import { useWalletState } from "/ui/shared/states/walletState";

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