import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import { enumerateRecordState, associationsCollectionsBadges } from '../../utils/destinyEnums';
import * as paths from '../../utils/paths';
import dudRecords from '../../data/dudRecords';
import ObservedImage from '../ObservedImage';
import { ProfileLink } from '../../components/ProfileLink';
import Collectibles from '../../components/Collectibles';
import ProgressBar from '../UI/ProgressBar';

import './styles.css';

const selfLink = hash => {
  let link = ['/triumphs'];
  let root = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.recordsRootNode];
  let seals = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode];

  root.children.presentationNodes.forEach(nP => {
    let nodePrimary = manifest.DestinyPresentationNodeDefinition[nP.presentationNodeHash];

    nodePrimary.children.presentationNodes.forEach(nS => {
      let nodeSecondary = manifest.DestinyPresentationNodeDefinition[nS.presentationNodeHash];

      nodeSecondary.children.presentationNodes.forEach(nT => {
        let nodeTertiary = manifest.DestinyPresentationNodeDefinition[nT.presentationNodeHash];

        if (nodeTertiary.children.records.length) {
          let found = nodeTertiary.children.records.find(c => c.recordHash === parseInt(hash, 10));
          if (found) {
            link.push(nodePrimary.hash, nodeSecondary.hash, nodeTertiary.hash, found.recordHash);
          }
        } else {
          nodeTertiary.children.presentationNodes.forEach(nQ => {
            let nodeQuaternary = manifest.DestinyPresentationNodeDefinition[nQ.presentationNodeHash];

            if (nodeQuaternary.children.records.length) {
              let found = nodeQuaternary.children.records.find(c => c.recordHash === hash);
              if (found) {
                link.push(nodePrimary.hash, nodeSecondary.hash, nodeTertiary.hash, nodeQuaternary.hash, found.recordHash);
              }
            }
          });
        }
      });
    });
  });

  if (link.length === 1) {
    seals.children.presentationNodes.forEach(nP => {
      let nodePrimary = manifest.DestinyPresentationNodeDefinition[nP.presentationNodeHash];

      if (nodePrimary.completionRecordHash === parseInt(hash, 10)) {
        link.push('seal', nodePrimary.hash);

        return;
      }

      if (nodePrimary.children.records.length) {
        let found = nodePrimary.children.records.find(c => c.recordHash === parseInt(hash, 10));
        if (found) {
          link.push('seal', nodePrimary.hash, found.recordHash);
        }
      }
    });
  }

  link = link.join('/');
  return link;
};

const unredeemed = member => {
  const characterRecords = member && member.data.profile.characterRecords.data;
  const profileRecords = member && member.data.profile.profileRecords.data.records;

  const hashes = [];

  let records = {
    ...profileRecords,
    ...characterRecords[member.characterId].records
  };

  Object.entries(records).forEach(([key, record]) => {
    const definitionRecord = manifest.DestinyRecordDefinition[key];

    if (definitionRecord && definitionRecord.redacted) {
      return;
    }

    if (definitionRecord.presentationInfo && definitionRecord.presentationInfo.parentPresentationNodeHashes && definitionRecord.presentationInfo.parentPresentationNodeHashes.length && !enumerateRecordState(record.state).invisible && !enumerateRecordState(record.state).objectiveNotCompleted && !enumerateRecordState(record.state).recordRedeemed) {
      // check to see if belongs to transitory expired seal
      const definitionParent = definitionRecord.presentationInfo.parentPresentationNodeHashes.length && manifest.DestinyPresentationNodeDefinition[definitionRecord.presentationInfo.parentPresentationNodeHashes[0]];
      const parentCompletionRecordData = definitionParent && definitionParent.completionRecordHash && definitionParent.scope === 1 ? characterRecords[member.characterId].records[definitionParent.completionRecordHash] : profileRecords[definitionParent.completionRecordHash];

      if (parentCompletionRecordData && enumerateRecordState(parentCompletionRecordData.state).rewardUnavailable && enumerateRecordState(parentCompletionRecordData.state).objectiveNotCompleted) {
        return;
      } else {
        hashes.push(key);
      }
    }
  });

  return hashes;
};

class Records extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.highlight && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  trackThisClick = e => {
    let tracked = this.props.triumphs.tracked;
    let hashToTrack = parseInt(e.currentTarget.dataset.hash, 10);
    let target = tracked.indexOf(hashToTrack);

    if (target > -1) {
      tracked = tracked.filter((hash, index) => index !== target);
    } else {
      tracked.push(hashToTrack);
    }

    this.props.setTrackedTriumphs(tracked);
  };

  render() {
    const { t, hashes, member, triumphs, collectibles, ordered, limit, selfLinkFrom, readLink, forceDisplay = false } = this.props;
    const highlight = parseInt(this.props.highlight, 10) || false;
    const recordsRequested = collectibles.hideDudRecords ? hashes.filter(hash => dudRecords.indexOf(hash) === -1) : hashes;
    const characterId = member && member.characterId;
    const characterRecords = member && member.data && member.data.profile.characterRecords.data;
    const profileRecords = member && member.data && member.data.profile.profileRecords.data.records;
    const profileRecordsTracked = member && member.data && member.data.profile.profileRecords.data.trackedRecordHash ? [member.data.profile.profileRecords.data.trackedRecordHash] : [];
    const tracked = triumphs.tracked;

    let recordsOutput = [];
    recordsRequested.forEach(hash => {
      const definitionRecord = manifest.DestinyRecordDefinition[hash];

      const recordScope = definitionRecord.scope || 0;
      const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

      // if (definitionRecord.intervalInfo.intervalObjectives.length)

      // console.log(recordData);

      let link = selfLink(hash);

      // readLink
      if (definitionRecord.loreHash && !selfLinkFrom && readLink) {
        link = `/read/record/${definitionRecord.hash}`;
      }

      const recordState = {
        completion: {
          value: 0,
          progress: 0,
          distance: 0
        },
        score: {
          value: 0,
          progress: 0,
          next: 0
        },
        objectives: [],
        intervals: [],
        intervalEl: null
      };

      if (definitionRecord.objectiveHashes) {
        recordState.score = {
          value: definitionRecord.completionInfo.ScoreValue,
          progress: definitionRecord.completionInfo.ScoreValue,
          next: definitionRecord.completionInfo.ScoreValue
        };

        recordState.objectives = definitionRecord.objectiveHashes.map((hash, i) => {
          const data = recordData && recordData.objectives.find(o => o.objectiveHash === hash);

          recordState.completion.value += data.completionValue;
          recordState.completion.progress += data.progress;

          return {
            ...data,
            score: definitionRecord.completionInfo.ScoreValue,
            el: <ProgressBar key={`${hash}${i}`} {...data} />
          };
        });

        const distance = recordState.objectives.reduce(
          (a, v) => {
            return {
              completion: (a.completion += v.completionValue || 0),
              progress: (a.progress += v.progress || 0)
            };
          },
          {
            completion: 0,
            progress: 0
          }
        );

        recordState.completion.distance = distance.progress / distance.completion;
      }

      if (definitionRecord.intervalInfo && definitionRecord.intervalInfo.intervalObjectives && definitionRecord.intervalInfo.intervalObjectives.length) {
        recordState.intervals = definitionRecord.intervalInfo.intervalObjectives.map((interval, i) => {
          const data = recordData && recordData.intervalObjectives.find(o => o.objectiveHash === interval.intervalObjectiveHash);
          const unredeemed = i + 1 > recordData.intervalsRedeemedCount && data.complete;

          return {
            ...data,
            unredeemed,
            score: interval.intervalScoreValue,
            el: <ProgressBar key={`${hash}${i}`} {...data} />
          };
        });

        recordState.score = {
          value: definitionRecord.intervalInfo.intervalObjectives.reduce((a, v) => {
            return a + (v.intervalScoreValue || 0);
          }, 0),
          progress: definitionRecord.intervalInfo.intervalObjectives.reduce((a, v, i) => {
            if (recordData && recordData.intervalsRedeemedCount > i) {
              return a + (v.intervalScoreValue || 0);
            } else {
              return a;
            }
          }, 0),
          next: (recordData && definitionRecord.intervalInfo.intervalObjectives[recordData.intervalsRedeemedCount] && definitionRecord.intervalInfo.intervalObjectives[recordData.intervalsRedeemedCount].intervalScoreValue) || 0
        };

        recordState.objectives = [...recordState.intervals.slice(-1)];

        recordState.completion.value += recordState.objectives[0].completionValue;
        recordState.completion.progress += recordState.objectives[0].progress;

        recordState.completion.distance = recordState.intervals[recordState.intervals.length - 1].progress / recordState.intervals[recordState.intervals.length - 1].completionValue;

        const lastInterval = recordState.intervals[recordState.intervals.length - 1];

        recordState.intervalEl = (
          <div className='progress-bar intervals'>
            {/* <div className={cx('check', { ed: lastInterval.completionValue && lastInterval.complete })} /> */}
            <div className='bar full'>
              <div className='text'>
                <div className='description'>{lastInterval.objectiveHash && manifest.DestinyObjectiveDefinition[lastInterval.objectiveHash] && manifest.DestinyObjectiveDefinition[lastInterval.objectiveHash].progressDescription}</div>
                {lastInterval.completionValue ? (
                  <div className='fraction'>
                    {lastInterval.progress}/{lastInterval.completionValue}
                  </div>
                ) : null}
              </div>
              <div className='bars'>
                {recordState.intervals.map((int, i) => {
                  const prevInt = recordState.intervals[Math.max(i - 1, 0)];

                  if (int.complete) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${(int.progress / int.completionValue) * 100}%` }} />
                      </div>
                    );
                  } else if (int.complete && !int.unredeemed) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${(int.progress / int.completionValue) * 100}%` }} />
                      </div>
                    );
                  } else if (prevInt && prevInt.complete) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${((int.progress - prevInt.completionValue) / (int.completionValue - prevInt.completionValue)) * 100}%` }} />
                      </div>
                    );
                  } else if (i === 0) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${(int.progress / int.completionValue) * 100}%` }} />
                      </div>
                    );
                  } else {
                    return <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })} />;
                  }
                })}
              </div>
            </div>
          </div>
        );
      }

      // if (definitionRecord.hash === 810213052) console.log(recordState);

      const enumerableState = recordData && Number.isInteger(recordData.state) ? recordData.state : 4;

      if (enumerateRecordState(enumerableState).invisible && (collectibles && collectibles.hideInvisibleRecords)) {
        return;
      }

      if (enumerateRecordState(enumerableState).recordRedeemed && (collectibles && collectibles.hideCompletedRecords) && !forceDisplay) {
        return;
      }

      let ref = highlight === definitionRecord.hash ? this.scrollToRecordRef : null;

      if (definitionRecord.redacted) {
        recordsOutput.push({
          completed: enumerateRecordState(enumerableState).recordRedeemed,
          progressDistance: recordState.completion.distance,
          hash: definitionRecord.hash,
          element: (
            <li
              key={definitionRecord.hash}
              ref={ref}
              className={cx('redacted', {
                highlight: highlight && highlight === definitionRecord.hash
              })}
            >
              <div className='properties'>
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                </div>
                <div className='text'>
                  <div className='name'>{t('Classified record')}</div>
                  <div className='description'>{t('This record is classified and may be revealed at a later time.')}</div>
                </div>
              </div>
            </li>
          )
        });
      } else {
        let description = definitionRecord.displayProperties.description !== '' ? definitionRecord.displayProperties.description : false;
        description = !description && definitionRecord.loreHash ? manifest.DestinyLoreDefinition[definitionRecord.loreHash].displayProperties.description.slice(0, 117).trim() + '...' : description;

        const isCollectionBadge = associationsCollectionsBadges.find(ass => ass.recordHash === definitionRecord.hash);

        let linkTo;
        if (link && selfLinkFrom) {
          linkTo = {
            pathname: link,
            state: {
              from: selfLinkFrom
            }
          };
        }
        if (link && readLink) {
          linkTo = {
            pathname: link,
            state: {
              from: this.props.location.pathname
            }
          };
        }
        if (link && !selfLinkFrom && isCollectionBadge) {
          linkTo = {
            pathname: `/collections/badge/${isCollectionBadge.badgeHash}`,
            state: {
              from: paths.removeMemberIds(this.props.location.pathname)
            }
          };
        }

        let rewards;
        if (definitionRecord.rewardItems && definitionRecord.rewardItems.length) {
          rewards = definitionRecord.rewardItems
            .map(r => {
              let definitionItem = manifest.DestinyInventoryItemDefinition[r.itemHash];
              let definitionCollectible = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] : false;

              if (definitionCollectible && !definitionCollectible.redacted) {
                return definitionCollectible.hash;
              } else {
                return false;
              }
            })
            .filter(r => r);
        }

        recordsOutput.push({
          completed: enumerateRecordState(enumerableState).recordRedeemed,
          progressDistance: recordState.completion.distance,
          hash: definitionRecord.hash,
          element: (
            <li
              key={definitionRecord.hash}
              ref={ref}
              className={cx({
                linked: link && linkTo,
                highlight: highlight && highlight === definitionRecord.hash,
                completed: enumerateRecordState(enumerableState).recordRedeemed,
                unredeemed: !enumerateRecordState(enumerableState).recordRedeemed && !enumerateRecordState(enumerableState).objectiveNotCompleted,
                tracked: tracked.concat(profileRecordsTracked).includes(definitionRecord.hash) && !enumerateRecordState(enumerableState).recordRedeemed && enumerateRecordState(enumerableState).objectiveNotCompleted,
                'no-description': !description,
                'has-intervals': recordState.intervals.length
              })}
            >
              {!enumerateRecordState(enumerableState).recordRedeemed && enumerateRecordState(enumerableState).objectiveNotCompleted && !profileRecordsTracked.includes(definitionRecord.hash) ? (
                <div className='track-this' onClick={this.trackThisClick} data-hash={definitionRecord.hash}>
                  <div />
                </div>
              ) : null}
              <div className='properties'>
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionRecord.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionRecord.displayProperties.name}</div>
                  <div className='meta'>
                    {manifest.statistics.triumphs && manifest.statistics.triumphs[definitionRecord.hash] ? (
                      <div className='commonality tooltip' data-hash='commonality' data-table='BraytechDefinition'>
                        {manifest.statistics.triumphs[definitionRecord.hash]}%
                      </div>
                    ) : null}
                    {recordState.intervals.length && recordState.intervals.filter(i => i.complete).length !== recordState.intervals.length ? (
                      <div className='intervals tooltip' data-hash='record_intervals' data-table='BraytechDefinition'>
                        {t('{{a}} of {{b}}', { a: recordState.intervals.filter(i => i.complete).length, b: recordState.intervals.length })}
                      </div>
                    ) : null}
                    {recordState.score.value !== 0 ? (
                      <div className='score tooltip' data-hash='score' data-table='BraytechDefinition'>
                        {recordState.intervals.length && recordState.score.progress !== recordState.score.value ? `${recordState.score.next}/${recordState.score.value}` : recordState.score.value}
                      </div>
                    ) : null}
                  </div>
                  <div className='description'>{description}</div>
                </div>
              </div>
              <div className='objectives'>{recordState.intervals.length ? recordState.intervalEl : recordState.objectives.map(e => e.el)}</div>
              {rewards && rewards.length ? (
                <ul className='list rewards collection-items'>
                  <Collectibles forceDisplay selfLinkFrom={paths.removeMemberIds(this.props.location.pathname)} hashes={rewards} />
                </ul>
              ) : null}
              {link && linkTo ? !selfLinkFrom && readLink ? <Link to={linkTo} /> : <ProfileLink to={linkTo} /> : null}
            </li>
          )
        });
      }
    });

    if (recordsRequested.length > 0 && recordsOutput.length === 0 && collectibles && collectibles.hideCompletedRecords && !forceDisplay) {
      recordsOutput.push({
        element: (
          <li key='lol' className='all-completed'>
            <div className='properties'>
              <div className='text'>{t('All completed')}</div>
            </div>
          </li>
        )
      });
    }

    if (ordered === 'progress') {
      recordsOutput = orderBy(recordsOutput, [item => item.progressDistance], ['desc']);
    } else if (ordered) {
      recordsOutput = orderBy(recordsOutput, [item => item.completed], ['asc']);
    } else {
    }

    if (limit) {
      recordsOutput = recordsOutput.slice(0, limit);
    }

    return recordsOutput.map(obj => obj.element);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    triumphs: state.triumphs,
    collectibles: state.collectibles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTrackedTriumphs: value => {
      dispatch({ type: 'SET_TRACKED_TRIUMPHS', payload: value });
    }
  };
}

Records = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Records);

export { Records, selfLink, unredeemed };

export default Records;
