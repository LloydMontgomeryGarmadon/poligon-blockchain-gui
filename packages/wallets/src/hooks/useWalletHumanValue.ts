import { useMemo } from 'react';
import type { Wallet } from '@bpx/api';
import { WalletType } from '@bpx/api';
import BigNumber from 'bignumber.js';
import { mojoToCATLocaleString, mojoToChiaLocaleString, useLocale } from '@bpx/core';

export default function useWalletHumanValue(wallet: Wallet, value?: string | number | BigNumber, unit?: string): string {
  const [locale] = useLocale();
  
  return useMemo(() => {
    if (wallet && value !== undefined) {
      const localisedValue = wallet.type === WalletType.CAT
        ? mojoToCATLocaleString(value, locale)
        : mojoToChiaLocaleString(value, locale);

      return `${localisedValue} ${unit}`;
    }

    return '';
  }, [wallet, value, unit, locale]);
}
