import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import orderBy from 'lodash/orderBy';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import dudRecords from '../../data/dudRecords';
import { enumerateRecordState } from '../../utils/destinyEnums';
import { ProfileLink } from '../../components/ProfileLink';
import Records from '../Records';

class RecordsAlmost extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  render() {
    const { t, member, collectibles, sort, limit } = this.props;
    const characterRecords = member && member.data.profile.characterRecords.data;
    const profileRecords = member && member.data.profile.profileRecords.data.records;

    let almost = [];
    let ignores = [];

    // ignore collections badges
    manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.badgesRootNode].children.presentationNodes.forEach(child => {
      ignores.push(manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash);
      manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].children.presentationNodes.forEach(subchild => {
        ignores.push(manifest.DestinyPresentationNodeDefinition[subchild.presentationNodeHash].completionRecordHash);
      });
    });

    let records = {
      ...profileRecords,
      ...characterRecords[member.characterId].records
    }

    Object.entries(records).forEach(([key, record]) => {
      const hash = parseInt(key, 10);

      if (collectibles.hideDudRecords && dudRecords.indexOf(hash) > -1) return;

      if (manifest.DestinyRecordDefinition[hash].redacted) {
        return;
      }

      if (ignores.includes(hash)) {
        return;
      }

      if (enumerateRecordState(record.state).invisible || enumerateRecordState(record.state).recordRedeemed) {
        return;
      }

      let completionValueTotal = 0;
      let progressValueTotal = 0;

      if (record.intervalObjectives) {
        console.log(record)
        const nextIncomplete = record.intervalObjectives.find(o => !o.complete);

        // interval record all completed
        if (!nextIncomplete) return;

        let v = parseInt(nextIncomplete.completionValue, 10);
        let p = parseInt(nextIncomplete.progress, 10);

        completionValueTotal = completionValueTotal + v;
        progressValueTotal = progressValueTotal + (p > v ? v : p); // prevents progress values that are greater than the completion value from affecting the average

      } else if (record.objectives) {
        record.objectives.forEach(obj => {
          let v = parseInt(obj.completionValue, 10);
          let p = parseInt(obj.progress, 10);

          completionValueTotal = completionValueTotal + v;
          progressValueTotal = progressValueTotal + (p > v ? v : p); // prevents progress values that are greater than the completion value from affecting the average
        });
      } else {
        return;
      }

      const distance = progressValueTotal / completionValueTotal;

      if (distance >= 1.0) {
        return;
      }

      let selfLinkFrom = this.props.selfLinkFrom || false;

      let definitionRecord = manifest.DestinyRecordDefinition[hash] || false;
      let score = 0;

      if (definitionRecord && definitionRecord.completionInfo) {
        score = definitionRecord.completionInfo.ScoreValue;
      }

      almost.push({
        distance,
        score,
        commonality: manifest.statistics.triumphs && manifest.statistics.triumphs[definitionRecord.hash] ? manifest.statistics.triumphs[definitionRecord.hash] : 0,
        element: <Records key={hash} selfLink selfLinkFrom={selfLinkFrom} hashes={[hash]} />
      });
    });

    if (sort === 1) {
      almost = orderBy(almost, [record => record.score, record => record.distance], ['desc', 'desc']);
    } else if (sort === 2) {
      almost = orderBy(almost, [record => record.commonality, record => record.distance], ['desc', 'desc']);
    } else {
      almost = orderBy(almost, [record => record.distance, record => record.score], ['desc', 'desc']);
    }

    almost = limit ? almost.slice(0, limit) : almost;

    return (
      <>
        <ul className={cx('list record-items')}>
          {almost.map(r => {
            return r.element;
          })}
        </ul>
        {this.props.pageLink ? (
          <ProfileLink className='button' to={{ pathname: '/triumphs/almost-complete', state: { from: '/triumphs' } }}>
            <div className='text'>{t('See next {{limit}}', { limit: 200 })}</div>
          </ProfileLink>
        ) : null}
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
)(RecordsAlmost);