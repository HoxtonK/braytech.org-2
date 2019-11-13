import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';
import { getSockets } from '../../../utils/destinyItems';
import manifest from '../../../utils/manifest';

const ghost = (item, detailedMode) => {
  let { sockets } = getSockets(item, false, detailedMode ? true : false, detailedMode ? false : true);

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  let intrinsic = sockets.find(socket => (socket.singleInitialItem ? socket.singleInitialItem.definition.itemCategoryHashes.includes(2237038328) : false));
  intrinsic = intrinsic ? manifest.DestinySandboxPerkDefinition[intrinsic.singleInitialItem.definition.perks[0].perkHash] : false;

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      <div className={cx('sockets', { 'has-sockets': sockets.length > 0, 'detailed-mode': detailedMode })}>
        {intrinsic ? (
          <div className='plug is-active intrinsic'>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${intrinsic.displayProperties.icon}`} />
            <div className='text'>
              <div className='name'>{intrinsic.displayProperties.name}</div>
              <div className='description'>{intrinsic.displayProperties.description}</div>
            </div>
          </div>
        ) : null}
        {sockets.length > 0
          ? sockets.map((socket, i) => {
            let group = socket.plugs
              .filter(plug => plug.definition.itemCategoryHashes && !plug.definition.itemCategoryHashes.includes(2237038328))
              .filter(plug => {
                if (!item.itemComponents && !detailedMode) {
                  if (plug.active) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              })
              .filter(plug => {
                if (item.itemComponents && item.itemComponents.instance && socket.mod) {
                  if (plug.active) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              });

            if (group.length > 0) {
              return (
                <div key={i} className='group'>
                  {group.length > 4 ? (
                      <>
                        {group.slice(0,3).map(plug => plug.element)}
                        <div className='plug ellipsis'>+ {group.length - 3} more</div>
                      </>
                    ) : group.map(plug => plug.element)}
                </div>
              )
            } else {
              return null;
            }
          })
          : null}
      </div>
      {item.itemSubType === 21 ? (
        <div className='description'>
          <pre>{item.displayProperties.description}</pre>
        </div>
      ) : null}
      {sourceString && !item.itemComponents ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default ghost;
