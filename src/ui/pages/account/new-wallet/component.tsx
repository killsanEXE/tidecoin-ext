import { Link } from "react-router-dom";
import s from "./styles.module.scss";

const NewWallet = () => {
  return (
    <div className={s.choice}>
      <div className={s.choiceDiv}>
        <Link to="/pages/new-mnemonic">Create with mnemonic (12 words)</Link>
      </div>
      <div className={s.choiceDiv}>
        <Link to="/pages/restore-mnemonic">Restore with mnemonic</Link>
      </div>
      <div className={s.choiceDiv}>
        <Link to="/pages/restore-priv-key">Restore with private key</Link>
      </div>
    </div>
  );
};

export default NewWallet;
