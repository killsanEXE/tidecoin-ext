import { FC, Fragment, useId } from "react";
import s from "./styles.module.scss";
import cn from "classnames";

export interface MenuItem {
  icon?: JSX.Element;
  action?: () => void;
  custom?: JSX.Element;
}

interface Props {
  items: MenuItem[];
  active: boolean;
}

const Menu: FC<Props> = ({ items, active }) => {
  const prefix = useId();

  return (
    <div className={cn(s.menu, { [s.active]: active })}>
      {items.map((i, index) => {
        if (!i.custom) {
          return (
            <Fragment key={`${index}${prefix}`}>
              <div onClick={i.action} className="cursor-pointer">
                {i.icon}
              </div>
              {index !== items.length - 1 && <div className={s.divider} />}
            </Fragment>
          );
        } else if (i.custom) {
          return (
            <Fragment key={`${index}${prefix}`}>
              {i.custom}
              {index !== items.length - 1 && <div className={s.divider} />}
            </Fragment>
          );
        }
      })}
    </div>
  );
};

export default Menu;
