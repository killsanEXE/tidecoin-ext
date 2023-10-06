import { AddressType } from "test-test-test-hd-wallet/src/hd/types";
import s from "./styles.module.scss";

const SwitchAddressType = (props: { handler: (type: AddressType) => void }) => {



  return (
    <div className={s.allTypes}>
      <div className={s.addressType} onClick={() => {
        props.handler(AddressType.P2WPKH)
      }}>
        <p className={s.typeTitle}>Native Segwit (P2WPKH)</p>
        <p className={s.example}></p>
      </div>
      <div className={s.addressType} onClick={() => {
        props.handler(AddressType.P2SH)
      }}>
        <p className={s.typeTitle}>Nested Segwit (P2SH-P2WPKH)</p>
        <p className={s.example}></p>
      </div>
      <div className={s.addressType} onClick={() => {
        props.handler(AddressType.P2PKH)
      }}>
        <p className={s.typeTitle}>Legacy (P2PKH)</p>
        <p className={s.example}></p>
      </div>
    </div>
  )
}

export default SwitchAddressType