import type { NFTAttribute } from '@floteo/api';

export default function isRankingAttribute(attribute: NFTAttribute) {
  if ('max_value' in attribute  && typeof attribute.max_value === 'number') {
    return true;
  }

  return false;
}
