import { useState } from "react";
import toast from "react-hot-toast";
import { useAppState } from "@/ui/states/appState";
import { useWalletState } from "@/ui/states/walletState";
import { useControllersState } from "@/ui/states/controllerState";

const ChangePassword = () => {

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { appPassword, logout } = useAppState((v) => ({
    appPassword: v.password,
    logout: v.logout,
  }));

  const { wallets } = useWalletState((v) => ({
    wallets: v.wallets,
  }));
  const { walletController } = useControllersState((v) => ({ walletController: v.walletController }))

  const executeChangePassword = async () => {
    if (appPassword === oldPassword && password === confirmPassword && password !== appPassword) {
      await walletController.saveWallets(password, wallets);
      logout();
    } else {
      toast.error("Try again");
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-field">
        <span className="input-span">Old password</span>
        <input
          type="password"
          value={oldPassword}
          className="input"
          onChange={(e) => {
            setOldPassword(e.target.value);
          }}
        />
      </div>
      <div className="form-field">
        <span className="input-span">New password</span>
        <input
          type="password"
          value={password}
          className="input"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="form-field">
        <span className="input-span">Confirm password</span>
        <input
          type="password"
          value={confirmPassword}
          className="input"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </div>
      <button className="btn primary" onClick={executeChangePassword}>
        Change password
      </button>
    </form>
  );
};

export default ChangePassword;
