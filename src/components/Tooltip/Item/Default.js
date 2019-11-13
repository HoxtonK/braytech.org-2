import React from 'react';
import Moment from 'react-moment';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

const Default = (props) => {
  const { itemHash, instanceId, itemComponents, quantity, state, rarity, type, primaryStat, stats, sockets, masterwork, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description
  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // flair string
  const flair = definitionItem.displaySource && definitionItem.displaySource !== '' && definitionItem.displaySource;

  const objectives = [];
  const rewards = [];
  
  const expirationDate = itemComponents && itemComponents.item && itemComponents.item.expirationDate;
  const timestamp = expirationDate && new Date().getTime();
  const timestampExpiry = expirationDate && new Date(expirationDate).getTime();

  // item objectives
  const instanceProgress = itemComponents && itemComponents.objectives;

  definitionItem.objectives &&
    definitionItem.objectives.objectiveHashes.forEach(hash => {
      const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

      const instanceProgressObjective = itemComponents && itemComponents.objectives && itemComponents.objectives.find(o => o.objectiveHash === hash);

      let playerProgress = {
        complete: false,
        progress: 0,
        objectiveHash: definitionObjective.hash
      };

      playerProgress = { ...playerProgress, ...instanceProgressObjective };

      objectives.push(<ProgressBar key={definitionObjective.hash} objectiveHash={definitionObjective.hash} {...playerProgress} />);
    });

  // potential rewards
  definitionItem.value &&
    definitionItem.value.itemValue.forEach(value => {
      if (value.itemHash !== 0) {
        const definitionReward = manifest.DestinyInventoryItemDefinition[value.itemHash];

        rewards.push(
          <li key={value.itemHash}>
            <div className='icon'>{definitionReward.displayProperties.icon && <ObservedImage className='image' src={`https://www.bungie.net${definitionReward.displayProperties.icon}`} />}</div>
            <div className='text'>
              {definitionReward.displayProperties.name}
              {value.quantity > 1 ? <> +{value.quantity}</> : null}
            </div>
          </li>
        );
      }
    });

  return (
    <>
      {flair ? (
        <div className='flair'>
          <p>{flair}</p>
        </div>
      ) : null}
      {flair && description && <div className='line' />}
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {objectives.length ? <div className='objectives'>{objectives}</div> : null}      
      {rewards.length ? (
        <div className='rewards'>
          <ul>{rewards}</ul>
        </div>
      ) : null}      
      {instanceProgress && instanceProgress.filter(o => !o.complete).length > 0 && expirationDate ? (
        <div className='expiry'>
          {timestampExpiry > timestamp ? (
            <>
              Expires <Moment fromNow>{expirationDate}</Moment>.
            </>
          ) : (
            <>Expired.</>
          )}
        </div>
      ) : null}      
      {quantity && definitionItem.inventory && definitionItem.inventory.maxStackSize > 1 && quantity === definitionItem.inventory.maxStackSize ? (
        <div className='quantity'>
          Quantity: <span>{quantity}</span> (MAX)
        </div>
      ) : null}
    </>
  );
};

export default Default;
