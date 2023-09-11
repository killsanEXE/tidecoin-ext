import { useWalletState } from "shared/states/walletState"
import "./SwitchAccountComponent.scss"
import CheckIcon from "components/icons/Checkicon"
import { useNavigate, useParams } from "react-router-dom";
import ArrowLeft from "components/icons/ArrowLeft";
import { useEffect } from "react";

export default function SwitchAccountComponent() {

    const navigate = useNavigate();
    const { fallbackUrl } = useParams();
    const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))

    useEffect(() => {
        console.log(fallbackUrl);
    }, [fallbackUrl])

    return (
        <div className="switch-acc-div">
            <div className="control-div">
                <button onClick={() => { navigate(fallbackUrl ?? "/") }}><ArrowLeft /> Back</button>
                <p>Select account</p>
            </div>
            {currentWallet?.accounts.map((acc, i) =>
                <div className="acc" key={i}>
                    {currentWallet.currentAccount.address === acc.address ? <CheckIcon /> : undefined}
                    {acc.brandName}
                </div>
            )}
        </div>
    )
}