import { WalletType } from '@cryptomines/api';
import type { Wallet } from '@cryptomines/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'KOP';
    default:
      return wallet.name;
  }
}
