import { useState } from "react";
import s from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ArrowLeft from "@/ui/components/icons/ArrowLeft";
import { useAppState } from "@/ui/states/appState";
import { useWalletState } from "@/ui/states/walletState";

const NewAccount = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { createNewAccount } = useWalletState((v) => ({
    createNewAccount: v.createNewAccount,
  }));

  const { password } = useAppState((v) => ({
    password: v.password,
  }));

  const createNewAcc = async () => {
    if (name.length <= 8) {
      await createNewAccount(password!, name);
      toast.success("Created new account");
      navigate("/home/wallet");
    } else toast.error("Maximum name length is 8");
  };

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <div className={s.backWrapper}>
        <p
          className={s.back}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft /> Back
        </p>
        <p>Create new account</p>
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
      <button className="btn primary" onClick={createNewAcc}>
        Create an account
      </button>
    </form>
  );
};

export default NewAccount;
