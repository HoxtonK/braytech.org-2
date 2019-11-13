import React from 'react';
import Moment from 'react-moment';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

const subclass = (item, member) => {
  
  const sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;
  const description = item.displayProperties.description !== '' ? item.displayProperties.description : false;
  const displaySource = item.displaySource && item.displaySource !== '' ? item.displaySource : false;

  // const subClassInfo = utils.getSubclassPathInfo(member.data.profile, member.characterId);

  const instanceProgress = item.itemComponents && item.itemComponents.objectives;

  const quanityMax = item.inventory && item.inventory.maxStackSize === parseInt(item.quantity, 10);

  let objectives = [];
  let rewards = [];

  item.objectives && item.objectives.objectiveHashes.forEach(hash => {
    const deinitionObjective = manifest.DestinyObjectiveDefinition[hash];

    let playerProgress = {
      complete: false,
      progress: 0,
      objectiveHash: deinitionObjective.hash
    };

    let instanceProgress = item.itemComponents && item.itemComponents.objectives && item.itemComponents.objectives.find(o => o.objectiveHash === hash);

    playerProgress = { ...playerProgress, ...instanceProgress };

    objectives.push(<ProgressBar key={deinitionObjective.hash} objectiveHash={deinitionObjective.hash} {...playerProgress} />);
  });

  item.value &&
    item.value.itemValue.forEach(value => {
      if (value.itemHash !== 0) {
        let definition = manifest.DestinyInventoryItemDefinition[value.itemHash];
        rewards.push(
          <li key={value.itemHash}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definition.displayProperties.icon}`} />
            <div className='text'>
              {definition.displayProperties.name}
              {value.quantity > 1 ? <> +{value.quantity}</> : null}
            </div>
          </li>
        );
      }
    });

  const nowMs = new Date().getTime();
  const expiry = item.itemComponents && item.itemComponents.item && item.itemComponents.item.expirationDate;
  const expiryMs = expiry && new Date(expiry).getTime();

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {objectives.length ? <div className='objectives'>{objectives}</div> : null}
      {displaySource ? (
        <div className='description'>
          <pre>{displaySource}</pre>
        </div>
      ) : null}
      {quanityMax && item.inventory.maxStackSize > 1 ? (
        <div className='quantity'>Quantity: <span>{item.inventory.maxStackSize}</span> (MAX)</div>
      ) : null}
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
      {rewards.length ? (
        <div className='rewards'>
          <ul>{rewards}</ul>
        </div>
      ) : null}
      {instanceProgress && instanceProgress.filter(o => !o.complete).length > 0 && expiry ? (
        <div className='expiry'>
          {expiryMs > nowMs ? (
            <>
              Expires <Moment fromNow>{expiry}</Moment>.
            </>
          ) : (
            <>Expired.</>
          )}
        </div>
      ) : null}
    </>
  );
};

export default subclass;
