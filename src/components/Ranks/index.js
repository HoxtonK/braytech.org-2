import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import ProgressBar from '../UI/ProgressBar';

import './styles.css';

class Mode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.data = {
      2772425241: {
        hash: 2772425241, // infamy
        activityHash: 3577607128,
        iconClass: 'infamy',
        currentResetCount: this.calculateResets(2772425241).current,
        totalResetCount: this.calculateResets(2772425241).total,
        totalPoints: utils.totalInfamy(),
        streakHash: 2939151659
      },
      2626549951: {
        hash: 2626549951, // valor
        activityHash: 2274172949,
        iconClass: 'valor',
        currentResetCount: this.calculateResets(3882308435).current,
        totalResetCount: this.calculateResets(3882308435).total,
        totalPoints: utils.totalValor(),
        streakHash: 2203850209
      },
      2000925172: {
        hash: 2000925172, // glory
        definition: manifest.DestinyProgressionDefinition[2000925172],
        activityHash: 2947109551,
        iconClass: 'glory',
        totalPoints: utils.totalGlory(),
        streakHash: 2572719399
      }
    };

    this.currentLanguage = this.props.i18n.getCurrentLanguage();
  }

  calculateResets = progressionHash => {
    const { characterId, characterProgressions } = this.props.data;

    return {
      current: characterProgressions[characterId].progressions[progressionHash] && Number.isInteger(characterProgressions[characterId].progressions[progressionHash].currentResetCount) ? characterProgressions[characterId].progressions[progressionHash].currentResetCount : '?',
      total:
        characterProgressions[characterId].progressions[progressionHash] && characterProgressions[characterId].progressions[progressionHash].seasonResets
          ? characterProgressions[characterId].progressions[progressionHash].seasonResets.reduce((acc, curr) => {
              if (curr.season > 3) {
                return acc + curr.resets;
              } else {
                return acc;
              }
            }, 0)
          : '?'
    };
  };

  render() {
    const { t, mini, hash } = this.props;
    const { characterId, characterProgressions } = this.props.data;

    let progressStepDescription = characterProgressions[characterId].progressions[hash].currentProgress === this.data[hash].totalPoints && characterProgressions[characterId].progressions[hash].stepIndex === manifest.DestinyProgressionDefinition[hash].steps.length ? manifest.DestinyProgressionDefinition[hash].steps[0].stepName : manifest.DestinyProgressionDefinition[hash].steps[(characterProgressions[characterId].progressions[hash].stepIndex + 1) % manifest.DestinyProgressionDefinition[hash].steps.length].stepName;

    let progressStepDescription_split = progressStepDescription.split(' ');

    if (progressStepDescription_split.length === 2)
      progressStepDescription =
        progressStepDescription_split[0]
          .toLowerCase()
          .split(' ')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ') +
        ' ' +
        progressStepDescription_split[1];

    return (
      <div className={cx('rank', { mini })}>
        <div className='icon'>
          <span className={`destiny-${this.data[hash].iconClass}`} />
        </div>
        <h4>{manifest.DestinyProgressionDefinition[hash].displayProperties.name}</h4>
        <div className='data'>
          {mini ? (
            <div>
              <div className='name'>{t('Points')}</div>
              <div className='value'>{characterProgressions[characterId].progressions[hash].currentProgress.toLocaleString('en-us')}</div>
            </div>
          ) : null}
          {!mini ? (
                <div>
                  <div className='name'>{t('Win streak')}</div>
                  <div className='value'>{characterProgressions[characterId].progressions[this.data[hash].streakHash].stepIndex}</div>
                </div>
              ) : null}
          {hash !== 2000925172 ? (
            <>
              <div>
                <div className='tooltip' data-hash='total_resets' data-table='BraytechDefinition'>
                  <div className='name'>{t('Total resets')}</div>
                  <div className='value'>{this.data[hash].totalResetCount}</div>
                </div>
              </div>
              <div>
                <div className='name'>{t('Season resets')}</div>
                <div className='value'>{this.data[hash].currentResetCount}</div>
              </div>
            </>
          ) : null}
        </div>
        {!mini ? (
          <div className='progress'>
            <ProgressBar
              classNames='step'
              objectiveHash={hash}
              description={progressStepDescription}
              progress={characterProgressions[characterId].progressions[hash].progressToNextLevel}
              completionValue={characterProgressions[characterId].progressions[hash].nextLevelAt}
              hideCheck
            />
            <ProgressBar
              classNames='total'
              objectiveHash={hash}
              description={t('Points')}
              progress={characterProgressions[characterId].progressions[hash].currentProgress}
              completionValue={this.data[hash].totalPoints}
              hideCheck
            />
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Mode);
