import React from 'react';
import { FormatLargeNumber } from '@cryptomines/core';
import { useGetHeightInfoQuery } from '@cryptomines/api-react';

export default function WalletStatusHeight() {
  const { data: height, isLoading } = useGetHeightInfoQuery({}, {
    pollingInterval: 10000,
  });

  if (isLoading) {
    return null;
  }

  if (height === undefined || height === null) {
    return null;
  }

  return (
    <>
      {'('}
      <FormatLargeNumber value={height} />
      {')'}
    </>
  );
}
