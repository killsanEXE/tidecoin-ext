import { Outlet, useNavigate } from "react-router-dom";
import s from "./styles.module.scss";
import cn from "classnames";
import ArrowLeft from "@/ui/components/icons/ArrowLeft";
import PlusInCircleIcon from "@/ui/components/icons/PlusInCirlceIcon";

export default function PagesLayout() {

    const navigate = useNavigate();

    return (
        <div className={s.layout}>
            <div className={s.controlDiv}>
                <p
                    className={cn(s.controlElem, s.back)}
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    <ArrowLeft /> Back
                </p>
                <p className={s.controlElem}>Switch account</p>
                <p
                    className={cn(s.controlElem, s.addNew)}
                    onClick={() => {
                        navigate("/pages/create-new-account");
                    }}
                >
                    <PlusInCircleIcon />
                </p>
            </div>
            <div className={s.contentDiv}>
                <Outlet />
            </div>
        </div>
    )
}