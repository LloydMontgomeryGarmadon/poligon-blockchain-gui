import React, { useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { useCurrencyCode, mojoToChiaLocaleString, CardSimple } from '@bpx/core';
import { useGetFarmedAmountQuery } from '@bpx/api-react';

export default function FarmCardTotalChiaFarmed() {
  const currencyCode = useCurrencyCode();
  const { data, isLoading, error } = useGetFarmedAmountQuery();

  const farmedAmount = data?.farmedAmount;

  const totalChiaFarmed = useMemo(() => {
    if (farmedAmount !== undefined) {
      return (
        <>
          {mojoToChiaLocaleString(farmedAmount)}
          &nbsp;
          {currencyCode}
        </>
      );
    }
  }, [farmedAmount]);

  return (
    <CardSimple
      title={<Trans>Total BPX Farmed</Trans>}
      value={totalChiaFarmed}
      loading={isLoading}
      error={error}
    />
  );
}
