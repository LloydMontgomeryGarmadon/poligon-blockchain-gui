import React from 'react';
import { Trans } from '@lingui/macro';
import Flex from '../Flex';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Shell } from 'electron';
import { default as walletPackageJson } from '../../../package.json';
import useAppVersion from '../../hooks/useAppVersion';

const { productName } = walletPackageJson;

const FAQ = styled.a`
color: rgb(128, 160, 194);
`;

const SendFeedback = styled.a`
color: rgb(128, 160, 194);
`;

export default function LayoutFooter() {
  const { version } = useAppVersion();

  return (
    <Flex flexDirection="row" flexGrow={1} justifyContent="space-between">
      <Typography color="textSecondary" variant="body2">
        {productName} {version}
      </Typography>
    </Flex>
  )
}