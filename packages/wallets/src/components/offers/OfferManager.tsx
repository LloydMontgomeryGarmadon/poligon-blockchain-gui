import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Trans, t } from '@lingui/macro';
import moment from 'moment';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Back,
  Card,
  CardHero,
  ConfirmDialog,
  Fee,
  Flex,
  Form,
  IconButton,
  LoadingOverlay,
  More,
  TableControlled,
  TooltipIcon,
  useOpenDialog,
  chiaToMojo,
  mojoToCATLocaleString,
  useShowSaveDialog,
  Tooltip,
} from '@bpx/core';
import { OfferTradeRecord } from '@bpx/api';
import fs from 'fs';
import { Remote } from 'electron';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  ListItemIcon,
  MenuItem,
  Typography
} from '@material-ui/core';
import { Cancel, GetApp as Download, Info, Reply as Share, Visibility } from '@material-ui/icons';
import { Trade as TradeIcon } from '@bpx/icons';
import { useCancelOfferMutation, useGetOfferDataMutation, useGetWalletsQuery } from '@bpx/api-react';
import { colorForOfferState, displayStringForOfferState, formatAmountForWalletType, suggestedFilenameForOffer } from './utils';
import useAssetIdName from '../../hooks/useAssetIdName';
import useWalletOffers from '../../hooks/useWalletOffers';
import { CreateOfferEditor } from './OfferEditor';
import { OfferImport } from './OfferImport';
import { OfferViewer } from './OfferViewer';
import OfferDataDialog from './OfferDataDialog';
import OfferState from './OfferState';

const StyledTradeIcon = styled(TradeIcon)`
  font-size: 4rem;
`;

type OfferCancellationOptions = {
  cancelWithTransaction: boolean;
  cancellationFee: number;
};

type ConfirmOfferCancellationProps = {
  onUpdateValues: (values: OfferCancellationOptions) => void;
};

function ConfirmOfferCancellation(props: ConfirmOfferCancellationProps) {
  const { onUpdateValues } = props;
  const methods = useForm({
    defaultValues: {
      cancelWithTransaction: true,
      fee: '',
    }
  });
  const { watch } = methods;
  const fee = watch('fee');
  const [cancelWithTransaction, setCancelWithTransaction] = useState<boolean>(true);

  // Communicate value updates to the parent component
  useEffect(() => {
    const feeInMojos = fee ? Number.parseFloat(chiaToMojo(fee)) : 0;
    onUpdateValues({ cancelWithTransaction, cancellationFee: feeInMojos });
  }, [cancelWithTransaction, fee]);

  return (
    <Form methods={methods}>
      <Flex flexDirection="column" gap={3}>
        <Typography variant="body1">
          <Trans>
            Are you sure you want to cancel your offer?
          </Trans>
        </Typography>
        <Typography variant="body1">
          <Trans>
            If you have already shared your offer file,
            you may need to submit a transaction to cancel
            the pending offer. Click "Cancel on blockchain"
            to submit a cancellation transaction.
          </Trans>
        </Typography>
        <Flex flexDirection="row" gap={3}>
          <Grid container>
            <Grid xs={6} item>
              <FormControlLabel
                control={<Checkbox name="cancelWithTransaction" checked={cancelWithTransaction} onChange={(event) => setCancelWithTransaction(event.target.checked)} />}
                label={
                  <>
                    <Trans>Cancel on blockchain</Trans>{' '}
                    <TooltipIcon>
                      <Trans>
                        Creates and submits a transaction on the blockchain that cancels the offer
                      </Trans>
                    </TooltipIcon>
                  </>
                }
              />
            </Grid>
            {cancelWithTransaction && (
              <Grid xs={6} item>
                <Fee
                  id="filled-secondary"
                  variant="filled"
                  name="fee"
                  color="secondary"
                  label={<Trans>Fee</Trans>}
                  fullWidth
                />
              </Grid>
            )}
          </Grid>
        </Flex>
      </Flex>
    </Form>
  );
}

type OfferListProps = {
  title: string | React.ReactElement;
  includeMyOffers: boolean;
  includeTakenOffers: boolean;
};

function OfferList(props: OfferListProps) {
  const { title, includeMyOffers, includeTakenOffers } = props;
  const showSaveDialog = useShowSaveDialog();
  const [getOfferData] = useGetOfferDataMutation();
  const [cancelOffer] = useCancelOfferMutation();
  const { data: wallets, isLoading: isLoadingWallets } = useGetWalletsQuery();
  const { lookupByAssetId } = useAssetIdName();
  const openDialog = useOpenDialog();
  const navigate = useNavigate();
  const {
    offers,
    isLoading: isWalletOffersLoading,
    page,
    rowsPerPage,
    count,
    pageChange,
  } = useWalletOffers(5, 0, includeMyOffers, includeTakenOffers, 'RELEVANCE', false);

  async function handleShowOfferData(offerData: string) {
    openDialog((
      <OfferDataDialog offerData={offerData} />
    ));
  }

  async function handleExportOffer(tradeId: string) {
    const { data: response }: { data: { offer: string, tradeRecord: OfferTradeRecord, success: boolean } } = await getOfferData(tradeId);
    const { offer: offerData, tradeRecord, success } = response;
    if (success === true) {
      const dialogOptions = {
        defaultPath: suggestedFilenameForOffer(tradeRecord.summary, lookupByAssetId),
      }
      const remote: Remote = (window as any).remote;
      const result = await showSaveDialog(dialogOptions);
      const { filePath, canceled } = result;

      if (!canceled && filePath) {
        try {
          fs.writeFileSync(filePath, offerData);
        }
        catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function handleCancelOffer(tradeId: string) {
    let options: OfferCancellationOptions = {
      cancelWithTransaction: false,
      cancellationFee: 0,
    };
    const cancelConfirmed = await openDialog(
      <ConfirmDialog
        title={<Trans>Cancel Offer</Trans>}
        confirmTitle={<Trans>Cancel Offer</Trans>}
        confirmColor="danger"
        cancelTitle={<Trans>Close</Trans>}
      >
        <ConfirmOfferCancellation
          onUpdateValues={(values) => options = values}
        />
      </ConfirmDialog>
    );

    if (cancelConfirmed === true) {
      await cancelOffer({ tradeId, secure: options.cancelWithTransaction, fee: options.cancellationFee });
    }
  }

  function handleRowClick(event: any, row: OfferTradeRecord) {
    navigate('/dashboard/wallets/offers/view', {
      state: {
        tradeRecord: row
      },
    });
  }

  const cols = useMemo(() => {
    return [
      {
        field: (row: OfferTradeRecord) => {
          const { status } = row;

          return (
            <Box onClick={(event) => handleRowClick(event, row)}>
              <Chip label={displayStringForOfferState(status)} variant="outlined" color={colorForOfferState(status)} />
            </Box>
          );
        },
        minWidth: '170px',
        maxWidth: '170px',
        title: <Trans>Status</Trans>
      },
      {
        field: (row: OfferTradeRecord) => {
          const resolvedOfferInfo = Object.entries(row.summary.offered).map(([assetId, amount]) => {
            const assetIdInfo = lookupByAssetId(assetId);
            const displayAmount = assetIdInfo ? formatAmountForWalletType(amount as number, assetIdInfo.walletType) : mojoToCATLocaleString(amount);
            const displayName = assetIdInfo?.displayName ?? t`Unknown token`;
            return {
              displayAmount,
              displayName,
            };
          });
          return (
            resolvedOfferInfo.map((info, index) => (
              <Flex flexDirection="row" gap={0.5} key={`${index}-${info.displayName}`}>
                <Typography variant="body2">{info.displayAmount}</Typography>
                <Typography noWrap variant="body2">{info.displayName}</Typography>
              </Flex>
            ))
          );
        },
        minWidth: '160px',
        title: <Trans>Offered</Trans>
      },
      {
        field: (row: OfferTradeRecord) => {
          const resolvedOfferInfo = Object.entries(row.summary.requested).map(([assetId, amount]) => {
            const assetIdInfo = lookupByAssetId(assetId);
            const displayAmount = assetIdInfo ? formatAmountForWalletType(amount as number, assetIdInfo.walletType) : mojoToCATLocaleString(amount);
            const displayName = assetIdInfo?.displayName ?? t`Unknown token`;
            return {
              displayAmount,
              displayName,
            };
          });
          return (
            resolvedOfferInfo.map((info, index) => (
              <Flex flexDirection="row" gap={0.5} key={`${index}-${info.displayName}`}>
                <Typography variant="body2">{info.displayAmount}</Typography>
                <Typography noWrap variant="body2">{info.displayName}</Typography>
              </Flex>
            ))
          );
        },
        minWidth: '160px',
        title: <Trans>Requested</Trans>
      },
      {
        field: (row: OfferTradeRecord) => {
          const { createdAtTime } = row;

          return (
            <Box onClick={(event) => handleRowClick(event, row)}>
              <Typography color="textSecondary" variant="body2">
                {moment(createdAtTime * 1000).format('LLL')}
              </Typography>
            </Box>
          );
        },
        minWidth: '220px',
        maxWidth: '220px',
        title: <Trans>Creation Date</Trans>,
      },
      {
        field: (row: OfferTradeRecord) => {
          const { tradeId, status } = row;
          const canExport = status === OfferState.PENDING_ACCEPT; // implies isMyOffer === true
          const canDisplayData = status === OfferState.PENDING_ACCEPT;
          const canCancel = status === OfferState.PENDING_ACCEPT;
          const canShare = status === OfferState.PENDING_ACCEPT;

          return (
            <Flex flexDirection="row" justifyContent="center" gap={0}>
              <Flex style={{width: '32px'}}>
                <More>
                  {({ onClose }: { onClose: () => void }) => (
                    <Box>
                      <MenuItem
                        onClick={() => {
                          onClose();
                          handleRowClick(undefined, row);
                        }}
                      >
                        <ListItemIcon>
                          <Info fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>
                          <Trans>Show Details</Trans>
                        </Typography>
                      </MenuItem>
                      {canDisplayData && (
                        <MenuItem
                          onClick={() => {
                            onClose();
                            handleShowOfferData(row._offerData);
                          }}
                        >
                          <ListItemIcon>
                            <Visibility fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="inherit" noWrap>
                            <Trans>Display Offer Data</Trans>
                          </Typography>
                        </MenuItem>
                      )}
                      {canExport && (
                        <MenuItem
                          onClick={() => {
                            onClose();
                            handleExportOffer(tradeId);
                          }}
                        >
                          <ListItemIcon>
                            <Download fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="inherit" noWrap>
                            <Trans>Save Offer File</Trans>
                          </Typography>
                        </MenuItem>
                      )}
                      {canCancel && (
                        <MenuItem
                          onClick={() => {
                            onClose();
                            handleCancelOffer(tradeId);
                          }}
                        >
                          <ListItemIcon>
                            <Cancel fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="inherit" noWrap>
                            <Trans>Cancel Offer</Trans>
                          </Typography>
                        </MenuItem>
                      )}
                    </Box>
                  )}
                </More>
              </Flex>
            </Flex>
          );
        },
        minWidth: '100px',
        maxWidth: '100px',
        title: <Flex justifyContent="center">Actions</Flex>
      },
    ];
  }, []);

  return (
    <Card title={title}>
      <LoadingOverlay loading={isWalletOffersLoading || isLoadingWallets}>
        {offers?.length ? (
          <TableControlled
            rows={offers}
            cols={cols}
            rowsPerPageOptions={[5, 25, 100]}
            count={count}
            rowsPerPage={rowsPerPage}
            pages={true}
            page={page}
            onPageChange={pageChange}
            isLoading={isWalletOffersLoading}
          />
        ) : (
          !isWalletOffersLoading && !isLoadingWallets && (
            <Typography variant="body2">
              <Trans>No current offers</Trans>
            </Typography>
          )
        )}
      </LoadingOverlay>
    </Card>
  );
}

export function OfferManager() {
  // const { data, isLoading } = useGetAllOffersQuery();
  const navigate = useNavigate();

  // const [myOffers, acceptedOffers]: OfferTradeRecord[] = useMemo(() => {
  //   if (isLoading || !data) {
  //     return [[], []];
  //   }

  //   // Show newest offers first
  //   const sortedOffers = [...data].sort((a: OfferTradeRecord, b: OfferTradeRecord) => b.createdAtTime - a.createdAtTime);
  //   const myOffers: OfferTradeRecord[] = [];
  //   const acceptedOffers: OfferTradeRecord[] = [];

  //   sortedOffers.forEach((offer) => {
  //     if (offer.isMyOffer) {
  //       myOffers.push(offer);
  //     }
  //     else {
  //       acceptedOffers.push(offer);
  //     }
  //   });

  //   return [myOffers, acceptedOffers];
  // }, [data, isLoading]);

  function handleCreateOffer() {
    navigate('/dashboard/wallets/offers/create');
  }

  function handleImportOffer() {
    navigate('/dashboard/wallets/offers/import');
  }

  return (
    <Flex flexDirection="column" gap={3}>
      <Flex flexGrow={1}>
        <Back variant="h5" to="/dashboard/wallets">
          <Trans>Manage Offers</Trans>
        </Back>
      </Flex>
      <Grid container>
        <Grid xs={12} md={6} lg={5} item>
          <CardHero>
            <StyledTradeIcon color="primary" />
            <Typography variant="body1">
              <Trans>
                Create an offer to exchange BPX or other tokens. View an offer to inspect and accept an offer made by another party.
              </Trans>
            </Typography>
            <Button onClick={handleCreateOffer} variant="contained" color="primary">
              <Trans>Create an Offer</Trans>
            </Button>
            <Button onClick={handleImportOffer} variant="contained" color="secondary">
              <Trans>View an Offer</Trans>
            </Button>
          </CardHero>
        </Grid>
      </Grid>
      <OfferList
        title={<Trans>Offers you created</Trans>}
        includeMyOffers={true}
        includeTakenOffers={false}
      />
      <OfferList
        title={<Trans>Offers you accepted</Trans>}
        includeMyOffers={false}
        includeTakenOffers={true}
      />
    </Flex>
  );
}

export function CreateOffer() {
  const location: any = useLocation();
  const openDialog = useOpenDialog();
  
  async function handleOfferCreated(obj: { offerRecord: any, offerData: any }) {
  }

  return (
    <Routes>
      <Route
        path="create"
        element={<CreateOfferEditor onOfferCreated={handleOfferCreated} />}
      />
      <Route path="import" element={<OfferImport />} />

      <Route path="view" element={(
        <OfferViewer
          tradeRecord={location?.state?.tradeRecord}
          offerData={location?.state?.offerData}
          offerSummary={location?.state?.offerSummary}
          offerFilePath={location?.state?.offerFilePath}
          imported={location?.state?.imported}
        />
      )} />
      <Route path="manage" element={<OfferManager />} />
    </Routes>
  );
}
