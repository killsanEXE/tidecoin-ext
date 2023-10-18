import { storageService } from "@/background/services";


const tabCheckin = ({
  data: {
    params: { origin, name, icon }
  },
  session
}) => {
  session.setProp({ origin, name, icon });
};

const getProviderState = async (req) => {
  const {
    session: { origin }
  } = req;

  const isUnlocked = storageService.appState.isUnlocked;
  const accounts: string[] = [];
  if (isUnlocked) {
    const currentAccount = await storageService.currentAccount;
    if (currentAccount) {
      accounts.push(currentAccount.address);
    }
  }
  return {
    network: "TIDECOIN",
    isUnlocked,
    accounts
  };
};

const keepAlive = () => {
  return 'ACK_KEEP_ALIVE_MESSAGE';
};

export default {
  tabCheckin,
  getProviderState,
  keepAlive
};
