import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "@/ui/components/icons/ArrowLeft";
import CheckIcon from "@/ui/components/icons/Checkicon";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import KeyIcon from "@/ui/components/icons/KeyIcon";
import PlusInCircleIcon from "@/ui/components/icons/PlusInCirlceIcon";
import SmallMenuicon from "@/ui/components/icons/SmallMenuIcon";
import TagIcon from "@/ui/components/icons/TagIcon";
import XMarkIcon from "@/ui/components/icons/XMarkIcon";
import { useWalletState } from "@/ui/shared/states/walletState";
import "./SwitchAccountComponent.scss";

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