import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { stringToIcons } from '../../../utils/destinyUtils';

import './styles.css';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classNames, hideCheck, hideFraction = false, chunky, progressionHash, objectiveHash } = this.props;

    let progress = this.props.progress || 0;
    let completionValue = this.props.completionValue || 0;
    let description = '';

    if (objectiveHash && manifest.DestinyObjectiveDefinition[objectiveHash]) {

      description = manifest.DestinyObjectiveDefinition[objectiveHash].progressDescription;
      
    } else if (progressionHash && manifest.DestinyProgressionDefinition[progressionHash]) {

      progress = this.props.progressToNextLevel;
      completionValue = this.props.nextLevelAt;
      description = manifest.DestinyProgressionDefinition[progressionHash].displayProperties && manifest.DestinyProgressionDefinition[progressionHash].displayProperties.displayUnitsName;

      if (description === '') {
        description = manifest.DestinyProgressionDefinition[progressionHash].displayProperties && manifest.DestinyProgressionDefinition[progressionHash].displayProperties.name;
      }
      
    }

    if (this.props.description) {
      description = this.props.description;
    }

    description = stringToIcons(description);
    const complete = progress >= completionValue;

    return (
      <div key={objectiveHash || progressionHash} className={cx('progress-bar', classNames, { complete: completionValue && complete, chunky: chunky })}>
        {!hideCheck ? <div className={cx('check', { ed: completionValue && complete })} /> : null}
        <div className={cx('bar', { full: hideCheck })}>
          <div className='text'>
            <div className='description'>{description}</div>
            {completionValue && !hideFraction ? (
              <div className='fraction'>
                {progress}/{completionValue}
              </div>
            ) : null}
          </div>
          {completionValue ? <div className='fill' style={{ width: `${Math.min((progress / completionValue) * 100, 100)}%` }} /> : null}
        </div>
      </div>
    );
  }
}

export default ProgressBar;
