import { useMemo } from 'react';
import type { Wallet } from '@cryptomines/api';
import { WalletType } from '@cryptomines/api';
import BigNumber from 'bignumber.js';
import { mojoToCATLocaleString, mojoToChiaLocaleString, useLocale } from '@cryptomines/core';

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
