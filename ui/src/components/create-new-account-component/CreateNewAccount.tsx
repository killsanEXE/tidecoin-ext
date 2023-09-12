import React, { useState } from 'react';
import "./CreateNewAccount.scss";
import ArrowLeft from 'components/icons/ArrowLeft';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useWalletState } from 'shared/states/walletState';

export default function CreateNewAccount() {

    const [name, setName] = useState("");
    const navigate = useNavigate();
    const { createNewAccount } = useWalletState((v) => ({ createNewAccount: v.createNewAccount }))

    const createNewAcc = () => {
        if (name.length <= 8) {
            createNewAccount(name);
            toast.success("Created new account")
            navigate("/home/wallet");
        } else toast.error("Maximum name length is 8")
    }

    return (
        <form className='form' onSubmit={(e) => e.preventDefault()}>
            <div className="back-wrapper">
                <p className="back" onClick={() => { navigate(-1) }}><ArrowLeft /> Back</p>
            </div>
            <p className="form-title">Enter the name:</p>
            <input
                type="text"
                max="8"
                className="input"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
            <button className="btn primary" onClick={createNewAcc}>Create an account</button>
        </form>
    )
}