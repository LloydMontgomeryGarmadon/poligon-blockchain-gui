import { useMemo } from 'react';
import { useGetWalletsQuery, useGetCatListQuery } from '@poligon/api-react';
import { WalletType } from '@poligon/api';
import type { Wallet } from '@poligon/api';
import { useCurrencyCode } from '@poligon/core';

export default function useWallet(walletId?: number | string): {
  loading: boolean;
  wallet?: Wallet;
  unit?: string;
} {
  const currencyCode = useCurrencyCode();
  const { data: wallets, isLoading } = useGetWalletsQuery();
  const { data: catList = [], isLoading: isCatListLoading } = useGetCatListQuery();

  const wallet = useMemo(() => {
    return wallets?.find((item) => item.id.toString() === walletId?.toString());
  }, [wallets, walletId]);

  const unit = useMemo(() => {
    if (wallet) {
      if (!isCatListLoading && wallet.type === WalletType.CAT) {
        const token = catList.find((item) => item.assetId === wallet.meta?.assetId);
        if (token) {
          return token.symbol;
        }

        return undefined;
      }
      
      return currencyCode;
    } 
  }, [wallet, currencyCode, isCatListLoading]);

  return { 
    wallet, 
    loading: isLoading,
    unit,
  };
}
