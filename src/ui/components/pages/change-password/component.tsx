import { useState } from "react";
import toast from "react-hot-toast";
import { useAppState } from "@/ui/states/appState";
import { useWalletState } from "@/ui/states/walletState";

const ChangePassword = () => {

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { appPassword, logout } = useAppState((v) => ({
    appPassword: v.password,
    logout: v.logout,
  }));

  const { wallets, walletController } = useWalletState((v) => ({
    wallets: v.wallets,
    walletController: v.controller
  }));

  const executeChangePassword = async () => {
    if (appPassword === oldPassword && password === confirmPassword && password !== appPassword) {
      await walletController.saveWallets(password, Array.from(wallets.values()));
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
      <input
        type="password"
        value={oldPassword}
        className="input"
        placeholder="Enter old password"
        onChange={(e) => {
          setOldPassword(e.target.value);
        }}
      />
      <input
        type="password"
        value={password}
        className="input"
        placeholder="Enter new password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <input
        type="password"
        value={confirmPassword}
        className="input"
        placeholder="Confirm new password"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      />
      <button className="btn primary" onClick={executeChangePassword}>
        Change password
      </button>
    </form>
  );
};

export default ChangePassword;
