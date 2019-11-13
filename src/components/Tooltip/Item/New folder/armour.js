import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { sockets } from '../../../utils/destinyItems/sockets';
import { stats } from '../../../utils/destinyItems/stats';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

const armour = (item, member, detailedMode) => {
  item.sockets = sockets(item);
  item.stats = stats(item);

  console.log(item.sockets, item.stats);

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let powerLevel;
  if (item.itemComponents && item.itemComponents.instance) {
    powerLevel = item.itemComponents.instance.primaryStat.value;
  } else if (member && member.data) {
    let character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);
    powerLevel = Math.floor((733 / 750) * character.light);
  } else {
    powerLevel = '700';
  }

  return {
    el: (
      <>
        <div className='damage armour'>
          <div className={cx('power')}>
            <div className='text'>{powerLevel}</div>
            <div className='text'>{manifest.DestinyStatDefinition[3897883278].displayProperties.name}</div>
          </div>
        </div>
        {sourceString && !item.itemComponents ? (
          <div className='source'>
            <p>{sourceString}</p>
          </div>
        ) : null}
<div className='stats'>
          {item.stats.map(s => {
            return (
              <div key={s.statHash} className='stat'>
                <div className='name'>{s.displayProperties.name}</div>
                <div className={cx('value', { bar: s.bar })}>
                  {s.bar ? (
                    <>
                      <div className='bar' data-value={s.value} style={{ width: `${s.value}%` }} />
                      <div className='int'>{s.value}</div>
                    </>
                  ) : (
                    s.value
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className='sockets has-sockets'>
          {item.sockets.socketCategories
            .map((c, i) => {
              if (c.sockets.length > 0) {
                return (
                  <div key={c.category.hash} className='category'>
                    {c.sockets.map(s => {
                      return (
                        <div key={s.socketIndex} className='socket'>

                        {s.plugOptions.filter(p => p.enabled).map(p => {
                          return (
                            <div key={p.plugItem.hash} className={cx('plug', { 'intrinsic': s.isIntrinsic, 'is-active': true })}>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${p.plugItem.displayProperties.icon ? p.plugItem.displayProperties.icon : `/img/misc/missing_icon_d2.png`}`} />
              <div className='text'>
                <div className='name'>{p.plugItem.displayProperties.name ? p.plugItem.displayProperties.name : `Unknown`}</div>
                <div className='description'>{p.plugItem.itemTypeDisplayName}</div>
              </div>
            </div>
                          )
                        })}
                      </div>
                      )
                    })}
                  </div>
                );
              } else {
                return null;
              }
            })
            .filter(c => c)}
        </div>
      </>
    ),
    masterwork: false
  };
};

export default armour;
