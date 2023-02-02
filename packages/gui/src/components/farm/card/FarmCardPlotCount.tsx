import React from 'react';
import { Trans } from '@lingui/macro';
import { FormatLargeNumber, CardSimple } from '@poligon/core';
import { useGetTotalHarvestersSummaryQuery } from '@poligon/api-react';

export default function FarmCardPlotCount() {
  const { plots, isLoading } = useGetTotalHarvestersSummaryQuery();

  return (
    <CardSimple
      title={<Trans>Plot Count</Trans>}
      value={<FormatLargeNumber value={plots} />}
      loading={isLoading}
    />
  );
}
