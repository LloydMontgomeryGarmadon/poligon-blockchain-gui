import BigNumber from 'bignumber.js';

const MOJO_PER_CHIA = new BigNumber('1000000000000');
const BLOCKS_PER_YEAR = 1681920;
const POOL_REWARD = '0.875'; // 7 / 8
const FARMER_REWARD = '0.125'; // 1 /8

export function calculatePoolReward(height: number): BigNumber {
  if (height === 0) {
    return MOJO_PER_CHIA.times('20000000').times(POOL_REWARD);
  }
  if (height < 1000000) {
    return MOJO_PER_CHIA.times('200').times(POOL_REWARD);
  }
  if (height < 1000000 + (3 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('20').times(POOL_REWARD);
  }
  if (height < 1000000 + (6 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('10').times(POOL_REWARD);
  }
  if (height < 1000000 + (9 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('5').times(POOL_REWARD);
  }
  if (height < 1000000 + (12 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('2.5').times(POOL_REWARD);
  }
  if (height < 1000000 + (15 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('1.25').times(POOL_REWARD);
  }

  return new BigNumber(0);
}

export function calculateBaseFarmerReward(height: number): BigNumber {
  if (height === 0) {
    return MOJO_PER_CHIA.times('20000000').times(FARMER_REWARD);
  }
  if (height < 1000000 + (3 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('200').times(FARMER_REWARD);
  }
  if (height < 1000000 + (6 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('20').times(FARMER_REWARD);
  }
  if (height < 1000000 + (9 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('10').times(FARMER_REWARD);
  }
  if (height < 1000000 + (12 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('5').times(FARMER_REWARD);
  }
  if (height < 1000000 + (12 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('2.5').times(FARMER_REWARD);
  }
  if (height < 1000000 + (15 * BLOCKS_PER_YEAR)) {
    return MOJO_PER_CHIA.times('1.25').times(FARMER_REWARD);
  }

  return new BigNumber(0);
}
