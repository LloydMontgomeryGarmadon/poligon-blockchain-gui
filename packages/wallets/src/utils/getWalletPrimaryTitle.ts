import { WalletType } from '@poligon/api';
import type { Wallet } from '@poligon/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'POL';
    default:
      return wallet.name;
  }
}
