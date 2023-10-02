import { useState } from "react";
import s from "./styles.module.scss"
import { useAppState } from "@/ui/states/appState";
import toast from "react-hot-toast";

const CheckPassword = (props: { handler: () => void; }) => {

    const [password, setPassword] = useState("");
    const { appPassword } = useAppState((v) => ({ appPassword: v.password }))

    const checkPassword = () => {
        if (password === appPassword) props.handler();
        else toast.error("Password is incorrect");
    }

    return (
        <form className={s.form} onSubmit={(e) => e.preventDefault()}>
            <p className={s.formTitle}>Enter your password</p>
            <input
                type="password"
                className="input"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <button className="btn primary" onClick={checkPassword}>
                Enter
            </button>
        </form>
    )
};

export default CheckPassword;
