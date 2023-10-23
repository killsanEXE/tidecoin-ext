import { useControllersState } from "@/ui/states/controllerState";
import { useEffect, useState } from "react";

import { KeyIcon } from "@heroicons/react/24/solid";
import Layout from "../layout";
import { Psbt } from "tidecoinjs-lib";

const CreateTx = () => {
  const [psbt, setPsbt] = useState<Psbt>();

  const { notificationController } = useControllersState((v) => ({
    notificationController: v.notificationController,
  }));

  useEffect(() => {
    (async () => {
      const approval = await notificationController.getApproval();
      setPsbt(approval.params.data);
    })();
  }, []);

  const fields = [
    {
      label: "Address",
      value: psbt.txOutputs[0].address,
    },
    {
      label: "Amount",
      value: `${psbt.txOutputs[0].value / 10 ** 8} TDC`,
    },
    {
      label: "Fee",
      value: `${psbt.getFee() / 10 ** 8} TDC`,
    },
  ];

  return (
    <Layout
      documentTitle="Create transaction"
      resolveBtnClassName="bg-text text-bg hover:bg-green-500 hover:text-bg"
      resolveBtnText="Send"
    >
      <>
        <KeyIcon className="w-10 h-10 text-yellow-500" />
        <h4 className="text-xl font-medium mb-6">Send tidecoin</h4>
        <div className="flex flex-col gap-4 w-full">
          {fields.map((i) => (
            <div key={i.label}>
              <label className="mb-2 block text-gray-300 pl-2">{i.label}</label>
              <div className="bg-input-bg rounded-xl px-5 py-2">{i.value}</div>
            </div>
          ))}
        </div>
      </>
    </Layout>
  );
};

export default CreateTx;
