export interface IApp {
  isReady: boolean;
  isUnlocked: boolean;
  vault: string[];
  password: string | undefined;
  updateAppState: (app: Partial<IApp>) => void;
  logout: () => void;
}
