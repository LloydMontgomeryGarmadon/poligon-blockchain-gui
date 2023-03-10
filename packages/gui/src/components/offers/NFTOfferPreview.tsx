import React from 'react';
import { Trans, t } from '@lingui/macro';
import { useGetNFTInfoQuery } from '@poligon/api-react';
import {
  Button,
  Flex,
  Loading,
  TooltipIcon,
  useColorModeValue,
} from '@poligon/core';
import { Card, Typography } from '@mui/material';
import NFTCard from '../nfts/NFTCard';
import { launcherIdFromNFTId } from '../../util/nfts';
import { NFTContextualActionTypes } from '../nfts/NFTContextualActions';
import styled from 'styled-components';

/* ========================================================================== */

const StyledPreviewContainer = styled(Flex)`
  width: 364px;
  border-left: ${({ theme }) =>
    `1px solid ${useColorModeValue(theme, 'border')}`};
  background-color: ${({ theme }) => theme.palette.background.default};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledCard = styled(Card)`
  width: 300px;
  height: 362px;
  display: flex;
  border-radius: 8px;
`;

/* ========================================================================== */

type NFTOfferPreviewProps = {
  nftId?: string;
};

export default function NFTOfferPreview(props: NFTOfferPreviewProps) {
  const { nftId } = props;
  const launcherId = launcherIdFromNFTId(nftId ?? '');
  const {
    data: nft,
    isLoading: isLoadingNFT,
    error: rawError,
  } = useGetNFTInfoQuery({ coinId: launcherId ?? '' });
  let error = rawError?.message ?? '';

  if (error) {
    if (error.startsWith('The coin is not a NFT.')) {
      error = t`NFT identifier does not reference a valid NFT coin.`;
    }
  }

  const cardContentElem = (function () {
    if (isLoadingNFT) {
      return (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          gap={1}
          style={{
            wordBreak: 'break-all',
          }}
        >
          <Loading center>
            <Trans>Loading NFT Info...</Trans>
          </Loading>
        </Flex>
      );
    } else if (launcherId && nft) {
      return (
        <NFTCard
          nft={nft}
          canExpandDetails={false}
          availableActions={
            NFTContextualActionTypes.CopyNFTId |
            NFTContextualActionTypes.OpenInBrowser |
            NFTContextualActionTypes.CopyURL
          }
        />
      );
    } else if (launcherId && error) {
      return (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          gap={1}
          padding={3}
        >
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Flex>
      );
    } else {
      return (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          gap={1}
          style={{
            wordBreak: 'break-all',
          }}
        >
          <Typography variant="h6">
            <Trans>NFT not specified</Trans>
          </Typography>
        </Flex>
      );
    }
  })();

  return (
    <StyledPreviewContainer
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
    >
      <Flex
        flexDirection="column"
        gap={1}
        style={{
          padding: '1.5rem',
        }}
      >
        <Typography variant="subtitle1">Preview</Typography>
        <StyledCard>{cardContentElem}</StyledCard>
      </Flex>
    </StyledPreviewContainer>
  );
}
