import i18n from "../../../../shared/locales/i18n";
import s from "./styles.module.scss";

const Language = () => {

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  }

  return (
    <div className={s.languages}>
      <button className="btn primary" onClick={() => { changeLanguage("en") }}>English</button>
      <button className="btn primary" onClick={() => { changeLanguage("ru") }}>Russian</button>
    </div>
  );
};

export default Language;
