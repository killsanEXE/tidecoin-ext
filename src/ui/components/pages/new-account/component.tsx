import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateNewAccount } from "@/ui/hooks/wallet";
import { useGetCurrentWallet } from "@/ui/states/walletState";

const NewAccount = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const createNewAccount = useCreateNewAccount();
  const currentWallet = useGetCurrentWallet();

  const nameAlreadyExists = (): boolean => {
    return currentWallet?.accounts.find(f => f.name?.trim() === name.trim()) !== undefined;
  }

  const createNewAcc = async () => {
    if (name.length <= 10 && !nameAlreadyExists()) {
      await createNewAccount(name);
      toast.success("Created new account", {
        style: { borderRadius: 0 },
        iconTheme: {
          primary: '#ffbc42',
          secondary: '#766c7f'
        }
      });
      navigate("/home/wallet");
    } else {
      if (nameAlreadyExists()) toast.error("Name for this account is already taken")
      else toast.error("Maximum name length is 8");
    }
  };

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
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
