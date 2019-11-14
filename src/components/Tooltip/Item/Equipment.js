import React from 'react';
import i18n from 'i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { damageTypeToString, ammoTypeToString, breakerTypeToIcon } from '../../../utils/destinyUtils';
import { statsMs } from '../../../utils/destinyItems/stats';
import ObservedImage from '../../ObservedImage';

const Equipment = props => {
  const { itemHash, instanceId, itemComponents, quantity, state, rarity, type, primaryStat, stats, sockets, masterwork, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description as flair string
  const flair = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // weapon damage type
  let damageTypeHash = definitionItem.itemType === enums.DestinyItemType.Weapon && definitionItem.damageTypeHashes[0];
  damageTypeHash = itemComponents && itemComponents.instance ? itemComponents.instance.damageTypeHash : damageTypeHash;

  return (
    <>
      {primaryStat ? (
        definitionItem.itemType === enums.DestinyItemType.Weapon ? (
          <>
            <div className='damage weapon'>
              <div className={cx('power', damageTypeToString(damageTypeHash).toLowerCase())}>
                {definitionItem.breakerType > 0 && <div className='breaker-type'>{breakerTypeToIcon(definitionItem.breakerTypeHash)}</div>}
                <div className={cx('icon', damageTypeToString(damageTypeHash).toLowerCase())} />
                <div className='text'>{primaryStat.value}</div>
              </div>
              <div className='slot'>
                <div className={cx('icon', ammoTypeToString(definitionItem.equippingBlock.ammoType).toLowerCase())} />
                <div className='text'>{ammoTypeToString(definitionItem.equippingBlock.ammoType)}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='damage armour'>
              <div className='power'>
                <div className='text'>{primaryStat.value}</div>
                <div className='text'>{primaryStat.displayProperties.name}</div>
              </div>
            </div>
          </>
        )
      ) : null}
      {primaryStat && flair && <div className='line' />}
      {flair ? (
        <div className='flair'>
          <p>{flair}</p>
        </div>
      ) : null}
      {stats && stats.length ? (
        <div className='stats'>
          {stats.map(s => {
            // map through stats

            const masterwork = (masterworkInfo && masterworkInfo.statHash === s.statHash && masterworkInfo.statValue) || 0;
            const base = s.value - masterwork;

            return (
              <div key={s.statHash} className='stat'>
                <div className='name'>{s.statHash === -1000 ? i18n.t('Total') : s.displayProperties.name}</div>
                <div className={cx('value', { bar: s.bar })}>
                  {s.bar ? (
                    <>
                      <div className='bar' data-value={base} style={{ width: `${base}%` }} />
                      <div className='bar masterwork' data-value={masterwork} style={{ width: `${masterwork}%` }} />
                      <div className='int'>{s.value}</div>
                    </>
                  ) : (
                    <>
                      {s.value} {statsMs.includes(s.statHash) && 'ms'}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {sockets && sockets.socketCategories && sockets.sockets.filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker).length ? (
        <div className={cx('sockets', {
          one: sockets.sockets
            .filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker)
            .map(s => s.plugOptions &&
              s.plugOptions.filter(p => p.isEnabled && p.isActive)
            )
            .filter(s => s.length)
            .length === 1
        })}>
          {sockets.socketCategories
            .map((c, i) => {
              // map through socketCategories

              if (c.sockets.length) {
                const plugs = c.sockets.filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker);

                if (plugs.length) {
                  return (
                    <div key={c.category.hash} className='category'>
                      {plugs.map(s => {
                        // filter for perks and map through sockets

                        return (
                          <div key={s.socketIndex} className='socket'>
                            {s.plugOptions
                              .filter(p => p.isEnabled && p.isActive)
                              .map(p => {
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

export default Equipment;
