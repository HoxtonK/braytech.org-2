import React from 'react';
import cx from 'classnames';

import { getSockets } from '../../../utils/destinyItems';
import manifest from '../../../utils/manifest';

const sparrow = (item, detailedMode) => {
  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  const { sockets } = getSockets(item, false, true, detailedMode ? false : true, false, [1608119540]);

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      <div className={cx('sockets', { 'has-sockets': sockets.length > 0, 'detailed-mode': detailedMode })}>
        {sockets.length > 0
          ? sockets.map((socket, i) => {
              let group = socket.plugs
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
      {sourceString && !item.itemComponents ? (
        <div className={cx('source', { 'no-border': !description })}>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default sparrow;
