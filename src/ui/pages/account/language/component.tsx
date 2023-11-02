import i18n from "../../../../shared/locales/i18n";
import { useAppState } from "../../../states/appState";
import { useControllersState } from "../../../states/controllerState";
import s from "./styles.module.scss";

const Language = () => {

  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState
  }))

  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController
  }))

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    await updateAppState({ language: lng });
    await walletController.saveWallets()
  }

  return (
    <div className={s.languages}>
      <button className="btn primary" onClick={() => { changeLanguage("en") }}>English</button>
      <button className="btn primary" onClick={() => { changeLanguage("ru") }}>Русский</button>
    </div>
  );
};

export default Language;
