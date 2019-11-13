import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';
import { getSockets } from '../../../utils/destinyItems';
import manifest from '../../../utils/manifest';

const emblem = (t, item) => {
  let sockets = [];

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  if (item.sockets) {
    sockets = getSockets(manifest, item, false, true, false, [1608119540]).sockets;

    let variants = item.sockets.socketEntries.find(socket => socket.singleInitialItemHash === 1608119540);
    if (variants) {
      let plugs = [];

      const emblemVariants = item.itemComponents && item.itemComponents.sockets && item.itemComponents.sockets.find(s => s.reusablePlugs && s.reusablePlugs.filter(p => p.plugItemHash === 1608119540).length);
      const emblemVariantsAvailable = emblemVariants && emblemVariants.reusablePlugs.filter(r => r.enabled && r.canInsert);

      variants.reusablePlugItems
        .filter(plug => plug.plugItemHash !== 1608119540)
        .forEach(plug => {
          const definitionPlug = manifest.DestinyInventoryItemDefinition[plug.plugItemHash];

          plugs.push({
            element: (
              <div key={definitionPlug.hash} className={cx('plug', { 'is-active': emblemVariantsAvailable && emblemVariantsAvailable.find(v => v.plugItemHash === plug.plugItemHash) })}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionPlug.displayProperties.icon}`} />
                <div className='text'>
                  <div className='name'>{definitionPlug.displayProperties.name}</div>
                  <div className='description'>{t('Emblem variant')}</div>
                </div>
              </div>
            )
          });
        });
      if (plugs.length > 0) {
        sockets.push({
          plugs
        });
      }
    }
  }

  return (
    <>
      <div className='emblem'>
        <ObservedImage className='image' src={`https://www.bungie.net${item.secondaryIcon}`} />
      </div>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {item.itemComponents && item.itemComponents.objectives && item.itemComponents.objectives.length ? (
        <div className='objectives'>
          {item.itemComponents.objectives.map(o => {
            if (o.objectiveHash === 2361405504) return null; // exclude "clan best" objective
            
            const definitionObjective = manifest.DestinyObjectiveDefinition[o.objectiveHash];

            return (
              <div key={o.objectiveHash} className='text'>
                <div className='name'>{definitionObjective.progressDescription}</div>
                <div className='value'>{o.progress}</div>
              </div>
            );
          })}
        </div>
      ) : null}
      <div className={cx('sockets', { 'has-sockets': sockets.length > 0 })}>{sockets.length > 0 ? sockets.map(socket => socket.plugs.map(plug => plug.element)) : null}</div>
      {sourceString ? (
        <div className={cx('source', { 'no-border': !description })}>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default emblem;
