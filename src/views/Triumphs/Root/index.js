import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import dudRecords from '../../../data/dudRecords';
import { enumerateRecordState, sealImages } from '../../../utils/destinyEnums';
import { ProfileLink } from '../../../components/ProfileLink';
import ObservedImage from '../../../components/ObservedImage';
import { unredeemed } from '../../../components/Records';
import RecordsAlmost from '../../../components/RecordsAlmost';
import RecordsTracked from '../../../components/RecordsTracked';
import Search from '../../../components/Search';

class Root extends React.Component {
  render() {
    const { t, member, collectibles } = this.props;
    const character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);
    const profileRecords = member.data.profile.profileRecords.data.records;
    const characterRecords = member.data.profile.characterRecords.data;

    const parent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.recordsRootNode];
    const sealsParent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode];

    const nodes = [];
    const sealNodes = [];
    const recordsStates = [];

    parent.children.presentationNodes.forEach(child => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      const states = [];

      definitionNode.children.presentationNodes.forEach(nodeChild => {
        const definitionNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

        definitionNodeChildNode.children.presentationNodes.forEach(nodeChildNodeChild => {
          const definitionNodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];

          if (definitionNodeChildNodeChildNode.redacted) {
            return;
          }

          definitionNodeChildNodeChildNode.children.records.forEach(record => {
            const definitionRecord = manifest.DestinyRecordDefinition[record.recordHash];
            const recordScope = definitionRecord.scope || 0;
            const recordData = recordScope === 1 ? characterRecords && characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

            if (recordData) {
              if (collectibles.hideDudRecords && dudRecords.indexOf(record.recordHash) > -1) return;

              recordData.hash = definitionRecord.hash;
              recordData.scoreValue = (definitionRecord.completionInfo && definitionRecord.completionInfo.ScoreValue) || 0;

              states.push(recordData);
              recordsStates.push(recordData);
            }
          });
        });
      });

      const nodeProgress = states.filter(record => enumerateRecordState(record.state).recordRedeemed).length;
      const nodeTotal = states.filter(record => !enumerateRecordState(record.state).invisible).length;

      nodes.push(
        <li key={definitionNode.hash} className={cx('linked', { completed: nodeTotal > 0 && nodeProgress === nodeTotal })}>
          {nodeTotal && nodeProgress !== nodeTotal ? <div className='progress-bar-background' style={{ width: `${(nodeProgress / nodeTotal) * 100}%` }} /> : null}
          <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionNode.originalIcon}`} />
          <div className='displayProperties'>
            <div className='name'>{definitionNode.displayProperties.name}</div>
            {nodeTotal ? (
              <div className='progress'>
                <span>{nodeProgress}</span> / {nodeTotal}
              </div>
            ) : null}
          </div>
          <ProfileLink to={`/triumphs/${definitionNode.hash}`} />
        </li>
      );
    });

    sealsParent.children.presentationNodes.forEach(child => {
      const definitionSeal = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      if (definitionSeal.redacted) {
        return;
      }

      const definitionCompletionRecord = definitionSeal.completionRecordHash && manifest.DestinyRecordDefinition[definitionSeal.completionRecordHash];

      const completionRecordData = definitionSeal && definitionSeal.completionRecordHash && definitionSeal.scope === 1 ? characterRecords[member.characterId].records[definitionSeal.completionRecordHash] : profileRecords[definitionSeal.completionRecordHash];

      if (completionRecordData && enumerateRecordState(completionRecordData.state).rewardUnavailable && enumerateRecordState(completionRecordData.state).objectiveNotCompleted) {
        return;
      }

      const states = [];
      definitionSeal.children.records.forEach(record => {
        const definitionRecord = manifest.DestinyRecordDefinition[record.recordHash];
        const recordScope = definitionRecord.scope || 0;
        const recordData = recordScope === 1 ? characterRecords && characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

        if (recordData) {
          states.push(recordData);
          recordsStates.push({ ...recordData, seal: true });
        }
      });

      let nodeProgress = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].progress;
      let nodeTotal = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].completionValue;

      // // MOMENTS OF TRIUMPH: MMXIX does not have the above ^
      if (definitionSeal.hash === 1002334440) {
        nodeProgress = states.filter(s => !enumerateRecordState(s.state).objectiveNotCompleted && enumerateRecordState(s.state).recordRedeemed).length;
        nodeTotal = 23;
      }

      const isComplete = nodeTotal && nodeProgress === nodeTotal ? true : false;

      const title = !definitionCompletionRecord.redacted && definitionCompletionRecord.titleInfo && definitionCompletionRecord.titleInfo.titlesByGenderHash[character.genderHash];

      sealNodes.push({
        completed: isComplete,
        element: (
          <li
            key={definitionSeal.hash}
            className={cx('linked', {
              completed: nodeTotal && isComplete
            })}
          >
            {nodeTotal && nodeProgress !== nodeTotal ? <div className='progress-bar-background' style={{ width: `${(nodeProgress / nodeTotal) * 100}%` }} /> : null}
            <ObservedImage className={cx('image', 'icon')} src={sealImages[definitionSeal.hash] ? `/static/images/extracts/badges/${sealImages[definitionSeal.hash]}` : `https://www.bungie.net${definitionSeal.displayProperties.icon}`} />
            <div className='displayProperties'>
              <div className='name'>{title || definitionSeal.displayProperties.name}</div>
              {nodeTotal ? (
                <div className='progress'>
                  <span>{nodeProgress}</span> / {nodeTotal}
                </div>
              ) : null}
            </div>
            <ProfileLink to={`/triumphs/seal/${definitionSeal.hash}`} />
          </li>
        )
      });
    });

    const unredeemedTriumphCount = unredeemed(member).length;

    return (
      <>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Total score')}</div>
          </div>
          <div className='total-score'>{this.props.member.data.profile.profileRecords.data.score.toLocaleString('en-us')}</div>
          {unredeemedTriumphCount > 0 ? (
            <ul className='list record-items notification-unredeemed'>
              <li className='linked unredeemed'>
                <div className='text'>
                  {unredeemedTriumphCount} {t('unredeemed triumphs')}
                </div>
                <i className='segoe-uniE0AB' />
                <ProfileLink to={{ pathname: '/triumphs/unredeemed', state: { from: '/triumphs' } }} />
              </li>
            </ul>
          ) : null}
          <div className='sub-header'>
            <div>{t('Search')}</div>
          </div>
          <Search scope='records' />
          <div className='sub-header'>
            <div>{t('Triumphs')}</div>
            <div>
              {recordsStates.filter(state => !state.seal).filter(state => enumerateRecordState(state.state).recordRedeemed).length}/{recordsStates.filter(state => !state.seal).filter(state => !enumerateRecordState(state.state).invisible).length}
            </div>
          </div>
          <ul className='list parents'>{nodes}</ul>
          <div className='sub-header'>
            <div>{t('Seals')}</div>
            <div>
              {sealNodes.filter(n => n.completed).length}/{sealNodes.length}
            </div>
          </div>
          <ul className='list parents seals'>{sealNodes.map(n => n.element)}</ul>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Almost complete')}</div>
          </div>
          <div className='almost-complete'>
            <RecordsAlmost limit='5' selfLinkFrom='/triumphs' pageLink />
          </div>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Tracked records')}</div>
          </div>
          <div className='tracked'>
            <RecordsTracked limit='5' selfLinkFrom='/triumphs' pageLink />
          </div>
        </div>
      </>
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
  connect(mapStateToProps),
  withTranslation()
)(Root);
