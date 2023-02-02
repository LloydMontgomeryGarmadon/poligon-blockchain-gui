import React from 'react';
import { Trans } from '@lingui/macro';
import { FormatLargeNumber, CardSimple } from '@poligon/core';
import { useGetTotalHarvestersSummaryQuery } from '@poligon/api-react';

export default function PlotCardTotalHarvesters() {
  const { harvesters, isLoading } = useGetTotalHarvestersSummaryQuery();

  return (
    <CardSimple
      title={<Trans>Total Harvesters</Trans>}
      value={<FormatLargeNumber value={harvesters} />}
      loading={isLoading}
    />
  );
}
