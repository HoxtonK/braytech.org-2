import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

const quest = item => {

  const description = item.displayProperties.description !== '' ? item.displayProperties.description : false;
  const displaySource = item.displaySource && item.displaySource !== '' ? item.displaySource : false;

  const objectives = [];
  const rewards = [];

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

  item.value && item.value.itemValue.forEach(value => {
    if (value.itemHash !== 0) {
      const definition = manifest.DestinyInventoryItemDefinition[value.itemHash];
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
      {rewards.length ? (
        <div className='rewards'>
          <ul>{rewards}</ul>
        </div>
      ) : null}
    </>
  );
};

export default quest;
