import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { enumerateRecordState, sealImages } from '../../../utils/destinyEnums';
import ObservedImage from '../../../components/ObservedImage';
import Records from '../../../components/Records';

class SealNode extends React.Component {
  render() {
    const { t } = this.props;
    const characterId = this.props.member.characterId;

    const characters = this.props.member.data.profile.characters.data;
    const character = characters.find(character => character.characterId === characterId);
    const profileRecords = this.props.member.data.profile.profileRecords.data.records;

    // for MOMENTS OF TRIUMPH: MMXIX
    const characterRecords = this.props.member.data.profile.characterRecords.data;

    const definitionSeal = manifest.DestinyPresentationNodeDefinition[this.props.match.params.secondary];
    
    const definitionCompletionRecord = definitionSeal.completionRecordHash && manifest.DestinyRecordDefinition[definitionSeal.completionRecordHash];

    // for MOMENTS OF TRIUMPH: MMXIX
    const states = [];
    definitionSeal.children.records.forEach(record => {
      const scope = profileRecords[record.recordHash] ? profileRecords[record.recordHash] : characterRecords[characterId].records[record.recordHash];
      if (scope) {
        states.push(scope);
      }
    });
    // --

    let progress = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].progress;
    let total = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].completionValue;

    // MOMENTS OF TRIUMPH: MMXIX does not have the above ^
    if (definitionSeal.hash === 1002334440) {
      progress = states.filter(s => !enumerateRecordState(s.state).objectiveNotCompleted && enumerateRecordState(s.state).recordRedeemed).length;
      total = 23;
    }

    const isComplete = progress === total ? true : false;

     const title = !definitionCompletionRecord.redacted && definitionCompletionRecord.titleInfo && definitionCompletionRecord.titleInfo.titlesByGenderHash[character.genderHash];

    const sealCommonality = manifest.statistics.seals && manifest.statistics.seals[definitionSeal.hash];

    return (
      <div className='node seal'>
        <div className='children'>
          <div className='icon'>
            <div className='corners t' />
            <ObservedImage className='image' src={sealImages[definitionSeal.hash] ? `/static/images/extracts/badges/${sealImages[definitionSeal.hash]}` : `https://www.bungie.net${definitionSeal.displayProperties.originalIcon}`} />
            <div className='corners b' />
          </div>
          <div className='text'>
            <div className='name'>{definitionSeal.displayProperties.name}</div>
            <div className='description'>{definitionSeal.displayProperties.description}</div>
          </div>
          <div className='until'>
            {total && isComplete ? <h4 className='completed'>{t('Seal completed')}</h4> : <h4>{t('Seal progress')}</h4>}
            <div className='progress'>
              <div className='text'>
                <div className='title'>{title}</div>
                {total ? (
                  <div className='fraction'>
                    {progress}/{total}
                  </div>
                ) : null}
              </div>
              <div className={cx('bar', { completed: total && isComplete })}>
                {total ? (
                  <div
                    className='fill'
                    style={{
                      width: `${(progress / total) * 100}%`
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
          {sealCommonality ? (
            <div className='commonality'>
              <h4>{t('Seal commonality')}</h4>
              <div className='value'>{sealCommonality}%</div>
              <div className='description'>
                {t("The seal's rarity represented as a percentage of players who are indexed by VOLUSPA.")}
              </div>
            </div>
          ) : null}
        </div>
        <div className='entries'>
          <ul className='list tertiary record-items'>
            <Records hashes={definitionSeal.children.records.map(child => child.recordHash)} highlight={this.props.match.params.tertiary || false} />
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTranslation()
)(SealNode);
