import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';

const Emblem = (props) => {
  const { itemHash, instanceId, itemComponents, quantity, state, rarity, type, primaryStat, stats, sockets, masterwork, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  return (
    <>
      <div className='emblem'>
        <ObservedImage className='image' src={`https://www.bungie.net${definitionItem.secondaryIcon}`} />
      </div>
      {sockets && sockets.socketCategories ? (
        <div className={cx('sockets', { one: sockets.sockets.filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker).length === 1 })}>
          {sockets.socketCategories
            .map((c, i) => {
              // map through socketCategories

              if (c.sockets.length) {
                const plugs = c.sockets; // 

                if (plugs.length) {
                  return (
                    <div key={c.category.hash} className='category'>
                      {plugs
                        .map(s => {

                          return (
                            <div key={s.socketIndex} className='socket'>
                              {s.plugOptions
                                .filter(p => p.plugItem && p.plugItem.hash !== 1608119540)
                                .filter(p => p.isEnabled)
                                .map(p => {
                                  // filter out default emblem
                                  // filter for enabled plugs and map through

                                  return (
                                    <div key={p.plugItem.hash} className={cx('plug', { intrinsic: s.isIntrinsic, enabled: true })}>
                                      <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${p.plugItem.displayProperties.icon ? p.plugItem.displayProperties.icon : `/img/misc/missing_icon_d2.png`}`} />
                                      <div className='text'>
                                        <div className='name'>{p.plugItem.displayProperties.name}</div>
                                        <div className='description'>{s.isIntrinsic ? p.plugItem.displayProperties.description : p.plugItem.itemTypeDisplayName}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        })}
                    </div>
                  );
                } else {
                  return false;
                }
              } else {
                return false;
              }
            })
            .filter(c => c)}
        </div>
      ) : null}
      {sockets && sockets.socketCategories && sourceString && <div className='line' />}
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default Emblem;
