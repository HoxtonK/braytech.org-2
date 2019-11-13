import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { energyTypeToAsset } from '../../../utils/destinyUtils';
// import ObservedImage from '../../ObservedImage';

const Mod = props => {
  const { itemHash, instanceId, itemComponents, quantity, state, rarity, type, primaryStat, stats, sockets, masterwork, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description
  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // perks
  const perks = definitionItem.perks.filter(p => manifest.DestinySandboxPerkDefinition[p.perkHash] && manifest.DestinySandboxPerkDefinition[p.perkHash].isDisplayable);

  // energy cost
  const energyCost = definitionItem.plug.energyCost;
  const energyType = energyCost && energyTypeToAsset(energyCost.energyTypeHash);

  return (
    <>
      {energyCost ? (
        <div className='energy-cost'>
          <div className={cx('value', energyType.string)}><div className='icon'>{energyType.icon}</div> {energyCost.energyCost}</div>
          <div className='text'>ENERGY COST</div>
        </div>
      ) : null}
      {perks && perks.length ? (
        <div className={cx('sockets perks', { one: perks.length === 0 })}>
          {perks
            .map(p => {
              const definitionPerk = manifest.DestinySandboxPerkDefinition[p.perkHash];

              return (
                <div key={p.perkHash} className='socket'>
                  <div className={cx('plug', { one: true, enabled: true, 'no-icon': true })}>
                    {/* <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionPerk.displayProperties.icon ? definitionPerk.displayProperties.icon : `/img/misc/missing_icon_d2.png`}`} /> */}
                    <div className='text'>
                      {/* <div className='name'>{definitionPerk.displayProperties && definitionPerk.displayProperties.name}</div> */}
                      <div className='description'>{definitionPerk.displayProperties && definitionPerk.displayProperties.description}</div>
                    </div>
                  </div>
                </div>
              );
            })
            .filter(c => c)}
        </div>
      ) : null}
      {perks && perks.length > 0 && sourceString && <div className='line' />}
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {description && <div className='line' />}
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default Mod;
