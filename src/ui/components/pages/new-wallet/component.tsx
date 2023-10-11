import { useNavigate } from "react-router-dom";
import s from "./styles.module.scss";

const NewWallet = () => {
  const navigate = useNavigate();

  return (
    <div className={s.choice}>
      <div className={s.choiceDiv}>
        <div
          className={s.variant}
          onClick={() => {
            navigate("/pages/new-mnemonic");
          }}
        >
          Create with mnemonic (12 words)
        </div>
      </div>
      <div className={s.choiceDiv}>
        <div
          className={s.variant}
          onClick={() => {
            navigate("/pages/restore-mnemonic");
          }}
        >
          Restore with mnemonic
        </div>
        <div
          className={s.variant}
          onClick={() => {
            navigate("/pages/restore-priv-key");
          }}
        >
          Restore with private key
        </div>
      </div>
    </div>
  );
};

export default NewWallet;
