import React from 'react';
import { withTranslation } from 'react-i18next';

import CollectiblesRarity from '../../../components/CollectiblesRarity';

import './styles.css';

class AllRankedByRarity extends React.Component {
  render() {
    const { t, member } = this.props;

    const characterCollectibles = member.data.profile.characterCollectibles.data;
    const profileCollectibles = member.data.profile.profileCollectibles.data.collectibles;

    let collectibles = {
      ...profileCollectibles,
      ...characterCollectibles[member.characterId].collectibles
    }

    collectibles = Object.keys(collectibles);

    return (
      <>
        <div className='all-ranked-by-rarity'>
          <div className='sub-header sub'>
            <div>{t('All collectibles')}</div>
          </div>
          <ul className='list collection-items'>
            <CollectiblesRarity hashes={collectibles} selfLinkFrom='/collections/all-ranked-by-rarity' />
          </ul>
        </div>
      </>
    );
  }
}

export default withTranslation()(AllRankedByRarity);
