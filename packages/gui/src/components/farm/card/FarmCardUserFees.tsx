import React, { useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { useCurrencyCode, mojoToChiaLocaleString, CardSimple, useLocale } from '@poligon/core';
import { useGetFarmedAmountQuery } from '@poligon/api-react';

export default function FarmCardUserFees() {
  const currencyCode = useCurrencyCode();
  const [locale] = useLocale();
  const { data, isLoading, error } = useGetFarmedAmountQuery();

  const feeAmount = data?.feeAmount;

  const userTransactionFees = useMemo(() => {
    if (feeAmount !== undefined) {
      return (
        <>
          {mojoToChiaLocaleString(feeAmount, locale)}
          &nbsp;
          {currencyCode}
        </>
      );
    }
  }, [feeAmount, locale, currencyCode]);

  return (
    <CardSimple
      title={<Trans>User Transaction Fees</Trans>}
      value={userTransactionFees}
      loading={isLoading}
      error={error}
    />
  );
}
