import { WalletAction, WalletType } from './wallets.enum';

export interface IWallet {
  currency: string;
  amount: number;
  userId?: number;
  type?: WalletType;
}

export interface IWalletStatusRes {
  action: WalletAction;
  wallet?: IWalletRes;
}

export interface IWalletRes {
  id?: number;
  currency: string;
  balance: number;
  userId?: number;
}
