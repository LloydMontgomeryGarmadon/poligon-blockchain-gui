import React, { useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { useCurrencyCode, mojoToChiaLocaleString } from '@bpx/core';
import { useGetFarmedAmountQuery } from '@bpx/api-react';
import FarmCard from './FarmCard';

export default function FarmCardTotalChiaFarmed() {
  const currencyCode = useCurrencyCode();
  const { data, isLoading } = useGetFarmedAmountQuery();

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
    <FarmCard
      title={<Trans>Total BPX Farmed</Trans>}
      value={totalChiaFarmed}
      loading={isLoading}
    />
  );
}
