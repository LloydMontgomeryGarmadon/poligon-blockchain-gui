import { WalletType } from '@bpx/api';
import type { Wallet } from '@bpx/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'BPX';
    default:
      return wallet.name;
  }
}
