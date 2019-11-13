import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import { stepsWithRecords, rewardsQuestLineOverrides, rewardsQuestLineOverridesShadowkeep, setDataQuestLineOverrides } from '../../data/questLines';
import { checklists, lookup } from '../../utils/checklists';
import ObservedImage from '../ObservedImage';
import Records from '../Records/';
import Items from '../Items';
import ProgressBar from '../UI/ProgressBar';

import './styles.css';

class QuestLine extends React.Component {
  getRewardsQuestLine = questLine => {
    let rewards = (questLine.value && questLine.value.itemValue && questLine.value.itemValue.length && questLine.value.itemValue.filter(v => v.itemHash !== 0)) || [];

    if (rewardsQuestLineOverrides[questLine.hash]) rewards = rewardsQuestLineOverrides[questLine.hash];

    const setData = this.getSetDataQuestLine(questLine);
    const rewardsShadowkeep = setData && rewardsQuestLineOverridesShadowkeep.find(s => setData.find(d => d.itemHash === s.itemHash));

    if (rewardsShadowkeep) rewards = rewardsShadowkeep.rewards;

    return rewards;
  };

  getSetDataQuestLine = questLine => {
    let setData = (questLine.setData && questLine.setData.itemList && questLine.setData.itemList.length && questLine.setData.itemList) || [];

    if (setDataQuestLineOverrides[questLine.hash]) setData = setDataQuestLineOverrides[questLine.hash];

    return setData;
  };

  render() {
    const { t, member, item } = this.props;
    const itemComponents = member.data.profile.itemComponents;
    const characterUninstancedItemComponents = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data;

    let definitionItem = item && item.itemHash && manifest.DestinyInventoryItemDefinition[item.itemHash];

    if (definitionItem && definitionItem.objectives && definitionItem.objectives.questlineItemHash && definitionItem.objectives.questlineItemHash) {
      definitionItem = manifest.DestinyInventoryItemDefinition[definitionItem.objectives.questlineItemHash];
    }

    if (definitionItem) {
      const questLine = cloneDeep(definitionItem);

      const setData = this.getSetDataQuestLine(questLine);

      let assumeCompleted = true;
      const steps =
        setData &&
        setData.length &&
        setData.map((s, i) => {
          s.i = i + 1;
          s.definitionStep = manifest.DestinyInventoryItemDefinition[s.itemHash];
          s.completed = assumeCompleted;

          if (s.itemHash === item.itemHash || setData.length === 1) {
            assumeCompleted = false;
            s.completed = false;
            s.active = true;
            s.itemInstanceId = item.itemInstanceId || null;
          }

          let progressData = item.itemInstanceId && itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : characterUninstancedItemComponents && characterUninstancedItemComponents[item.itemHash] ? characterUninstancedItemComponents[item.itemHash].objectives : false;

          let stepMatch = false;
          if (progressData && s.definitionStep.objectives && s.definitionStep.objectives.objectiveHashes.length === progressData.length) {
            progressData.forEach(o => {
              if (s.definitionStep.objectives.objectiveHashes.includes(o.objectiveHash)) {
                stepMatch = true;
              } else {
                stepMatch = false;
              }
            });
          }

          if (stepMatch) {
            s.progress = progressData;
          } else if (assumeCompleted && s.definitionStep.objectives && s.definitionStep.objectives.objectiveHashes.length) {
            s.progress = s.definitionStep.objectives.objectiveHashes.map(o => {
              let definitionObjective = manifest.DestinyObjectiveDefinition[o];

              return {
                complete: true,
                progress: definitionObjective.completionValue,
                completionValue: definitionObjective.completionValue,
                objectiveHash: definitionObjective.hash
              };
            });
          } else {
            s.progress = [];
          }

          return s;
        });

      const questLineSource = questLine.sourceData && questLine.sourceData.vendorSources && questLine.sourceData.vendorSources.length ? questLine.sourceData.vendorSources : steps && steps.length && steps[0].definitionStep.sourceData && steps[0].definitionStep.sourceData.vendorSources && steps[0].definitionStep.sourceData.vendorSources.length ? steps[0].definitionStep.sourceData.vendorSources : false;

      const descriptionQuestLine = questLine.displaySource && questLine.displaySource !== '' ? questLine.displaySource : questLine.displayProperties.description && questLine.displayProperties.description !== '' ? questLine.displayProperties.description : steps[0].definitionStep.displayProperties.description;

      const rewardsQuestLine = this.getRewardsQuestLine(questLine);
      const rewardsQuestStep = (steps && steps.length && steps.filter(s => s.active) && steps.filter(s => s.active).length && steps.filter(s => s.active)[0].definitionStep && steps.filter(s => s.active)[0].definitionStep.value && steps.filter(s => s.active)[0].definitionStep.value.itemValue && steps.filter(s => s.active)[0].definitionStep.value.itemValue.length && steps.filter(s => s.active)[0].definitionStep.value.itemValue.filter(v => v.itemHash !== 0)) || [];

      // const checklistEntry = lookup({ key: 'pursuitHash', value: definitionItem.hash });

      // console.log(checklistEntry)

      return (
        <div className='quest-line'>
          <div className='module header'>
            <div className='name'>{questLine.displayProperties.name}</div>
          </div>
          <div className='module'>
            <ReactMarkdown className='displaySource' source={descriptionQuestLine} />
            {rewardsQuestLine.length ? (
              <>
                <h4>{t('Rewards')}</h4>
                <ul className='list inventory-items'>
                  <Items items={rewardsQuestLine} />
                </ul>
              </>
            ) : null}
            {questLineSource ? (
              <>
                <h4>{t('Source')}</h4>
                <div className='sources'>
                  {questLineSource.map(s => {
                    if (s.vendorHash) {
                      let definitionVendor = manifest.DestinyVendorDefinition[s.vendorHash];
                      let definitionFaction = definitionVendor && definitionVendor.factionHash ? manifest.DestinyFactionDefinition[definitionVendor.factionHash] : false;

                      return (
                        <div key={s.vendorHash} className='vendor tooltip' data-hash={s.vendorHash} data-table='DestinyVendorDefinition'>
                          <div className='name'>{definitionVendor.displayProperties.name}</div>
                          {definitionFaction ? <div className='faction'>{definitionFaction.displayProperties.name}</div> : null}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </>
            ) : null}
            {steps && steps.length > 3 ? (
              <div className='current-step'>
                <h4>{t('Current step')}</h4>
                <div className='steps'>
                  {steps
                    .filter(s => s.active)
                    .map(s => {
                      let objectives = [];
                      s.definitionStep &&
                        s.definitionStep.objectives &&
                        s.definitionStep.objectives.objectiveHashes.forEach(element => {
                          let definitionObjective = manifest.DestinyObjectiveDefinition[element];

                          let progress = {
                            complete: false,
                            progress: 0,
                            completionValue: definitionObjective.completionValue,
                            objectiveHash: definitionObjective.hash,
                            ...s.progress.find(o => o.objectiveHash === definitionObjective.hash)
                          };

                          let relatedRecords = stepsWithRecords.filter(r => r.objectiveHash === definitionObjective.hash).map(r => r.recordHash);

                          objectives.push(
                            <React.Fragment key={definitionObjective.hash}>
                              <ProgressBar objectiveHash={definitionObjective.hash} {...progress} />
                              {relatedRecords && relatedRecords.length ? (
                                <ul className='list record-items'>
                                  <Records selfLinkFrom={`/inventory/pursuits/${item.itemHash}`} forceDisplay hashes={relatedRecords} />
                                </ul>
                              ) : null}
                            </React.Fragment>
                          );
                        });

                      const descriptionStep = s.definitionStep.displayProperties.description && s.definitionStep.displayProperties.description !== '' ? s.definitionStep.displayProperties.description : false;

                      return (
                        <div key={s.itemHash} className='step'>
                          <div className='header'>
                            <div className='number'>{s.i}</div>
                            <div className='name'>{s.definitionStep.displayProperties.name}</div>
                          </div>
                          {descriptionStep ? <ReactMarkdown className='description' source={descriptionStep} /> : null}
                          {objectives.length ? <div className='objectives'>{objectives}</div> : null}
                        </div>
                      );
                    })}
                </div>
                {rewardsQuestStep.length ? (
                  <>
                    <h4>{t('Rewards')}</h4>
                    <div className='rewards'>
                      <ul>
                        {rewardsQuestStep.map(r => {
                          const definitionItem = manifest.DestinyInventoryItemDefinition[r.itemHash];
                          return (
                            <li key={definitionItem.hash} className={cx({ tooltip: definitionItem.hash !== 2127149322 })} data-hash={definitionItem.hash}>
                              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                              <div className='text'>
                                {definitionItem.displayProperties.name}
                                {r.quantity > 1 ? <> +{r.quantity}</> : null}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className='module'>
            {steps ? (
              <>
                <h4>{t('Steps')}</h4>
                <div className='steps'>
                  {steps &&
                    steps.length &&
                    steps.map(s => {
                      let objectives = [];
                      s.definitionStep &&
                        s.definitionStep.objectives &&
                        s.definitionStep.objectives.objectiveHashes.forEach(element => {
                          let definitionObjective = manifest.DestinyObjectiveDefinition[element];

                          let progress = {
                            complete: false,
                            progress: 0,
                            completionValue: definitionObjective.completionValue,
                            objectiveHash: definitionObjective.hash,
                            ...s.progress.find(o => o.objectiveHash === definitionObjective.hash)
                          };

                          let relatedRecords = stepsWithRecords.filter(r => r.objectiveHash === definitionObjective.hash).map(r => r.recordHash);

                          objectives.push(
                            <React.Fragment key={definitionObjective.hash}>
                              <ProgressBar {...progress} />
                              {relatedRecords && relatedRecords.length ? (
                                <ul className='list record-items'>
                                  <Records selfLinkFrom={`/inventory/pursuits/${item.itemHash}`} forceDisplay hashes={relatedRecords} />
                                </ul>
                              ) : null}
                            </React.Fragment>
                          );
                        });

                      const descriptionStep = s.definitionStep.displayProperties.description && s.definitionStep.displayProperties.description !== '' ? s.definitionStep.displayProperties.description : false;

                      return (
                        <div key={s.itemHash} className={cx('step', { completed: s.completed })}>
                          <div className='header'>
                            <div className='number'>{s.i}</div>
                            <div className='name'>{s.definitionStep.displayProperties.name}</div>
                          </div>
                          {descriptionStep ? <ReactMarkdown className='description' source={descriptionStep} /> : null}
                          {objectives.length ? <div className='objectives'>{objectives}</div> : null}
                        </div>
                      );
                    })}
                </div>
              </>
            ) : null}
          </div>
        </div>
      );
    }

    return null;
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
)(QuestLine);
