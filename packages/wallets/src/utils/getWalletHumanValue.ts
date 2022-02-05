import type { Wallet } from '@bpx/api';
import { WalletType } from '@bpx/api';
import { mojoToCATLocaleString, mojoToChiaLocaleString } from '@bpx/core';

export default function getWalletHumanValue(wallet: Wallet, value: number): string {
  return wallet.type === WalletType.CAT
    ? mojoToCATLocaleString(value)
    : mojoToChiaLocaleString(value);
}
