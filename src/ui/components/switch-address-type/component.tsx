import { AddressType } from "test-test-test-hd-wallet/src/hd/types";
import s from "./styles.module.scss";
import { CheckIcon } from "@heroicons/react/24/outline";

const SwitchAddressType = (props: {
  handler: (type: AddressType) => void;
  selectedType: AddressType;
}) => {
  return (
    <div className={s.allTypes}>
      <div
        className={s.addressType}
        onClick={() => {
          props.handler(AddressType.P2WPKH);
        }}
      >
        {props.selectedType === AddressType.P2WPKH ? <CheckIcon /> : ""}
        <div className={s.infoDiv}>
          <p className={s.typeTitle}>Native Segwit (P2WPKH)</p>
          <p className={s.example}></p>
        </div>
      </div>
      <div
        className={s.addressType}
        onClick={() => {
          props.handler(AddressType.P2SH);
        }}
      >
        {props.selectedType === AddressType.P2SH ? <CheckIcon /> : ""}
        <div className={s.infoDiv}>
          <p className={s.typeTitle}>Nested Segwit (P2SH-P2WPKH)</p>
          <p className={s.example}></p>
        </div>
      </div>
      <div
        className={s.addressType}
        onClick={() => {
          props.handler(AddressType.P2PKH);
        }}
      >
        {props.selectedType === AddressType.P2PKH ? <CheckIcon /> : ""}
        <div className={s.infoDiv}>
          <p className={s.typeTitle}>Legacy (P2PKH)</p>
          <p className={s.example}></p>
        </div>
      </div>
    </div>
  );
};

export default SwitchAddressType;
