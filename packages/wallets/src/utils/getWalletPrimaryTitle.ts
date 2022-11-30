import { WalletType } from '@floteo/api';
import type { Wallet } from '@floteo/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'FLO';
    default:
      return wallet.name;
  }
}
