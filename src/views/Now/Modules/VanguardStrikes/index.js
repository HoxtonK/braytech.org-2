import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';

import manifest from '../../../../utils/manifest';
import * as enums from '../../../../utils/destinyEnums';

import './styles.css';

class VanguardStrikes extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const weeklyNightfallStrikeActivities = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;

      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

      if (definitionActivity && definitionActivity.activityModeTypes && definitionActivity.activityModeTypes.includes(46) && !definitionActivity.guidedGame && definitionActivity.modifiers && definitionActivity.modifiers.length > 2) return true;

      return false;
    });
    const weeklyNightfallStrikes = {
      activities: {
        ordeal: Object.keys(enums.nightfalls)
          .filter(k => enums.nightfalls[k].ordealHashes.find(o => weeklyNightfallStrikeActivities.find(w => w.activityHash === o)))
          .map(h => ({ activityHash: h })),
        scored: weeklyNightfallStrikeActivities.filter(w => !Object.keys(enums.nightfalls).find(k => enums.nightfalls[k].ordealHashes.find(o => o === w.activityHash)))
      },
      displayProperties: {
        name: manifest.DestinyActivityDefinition[492869759].displayProperties.name
      },
      headings: {
        ordeal: t('Ordeal nightfall'),
        scored: t('Scored nightfalls')
      }
    };

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{weeklyNightfallStrikes.displayProperties.name}</div>
        </div>
        {weeklyNightfallStrikes.activities.scored.length ? (
          <>
            {weeklyNightfallStrikes.activities.ordeal.length ? (
              <>
                <h4>{weeklyNightfallStrikes.headings.ordeal}</h4>
                <ul className='list activities'>
                  {orderBy(
                    enums.nightfalls[weeklyNightfallStrikes.activities.ordeal[0].activityHash].ordealHashes.map(o => ({
                      activityLightLevel: manifest.DestinyActivityDefinition[o].activityLightLevel,
                      activityHash: weeklyNightfallStrikes.activities.ordeal[0].activityHash,
                      ordealHash: o
                    })),
                    [a => a.activityLightLevel],
                    ['asc']
                  )
                    .slice(0, 1)
                    .map((a, i) => {
                      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];
                      const definitionOrdeal = manifest.DestinyActivityDefinition[a.ordealHash];

                      return {
                        light: definitionOrdeal.activityLightLevel,
                        el: (
                          <li key={i} className='linked tooltip' data-table='DestinyActivityDefinition' data-hash={a.ordealHash} data-mode='175275639'>
                            <div className='name'>{definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown')}</div>
                            <div>
                              <div className='time'>{definitionActivity.timeToComplete ? <>{t('{{number}} mins', { number: definitionActivity.timeToComplete || 0 })}</> : null}</div>
                              <div className='light'>
                                <span>{definitionOrdeal.activityLightLevel}</span>
                              </div>
                            </div>
                          </li>
                        )
                      };
                    })
                    .map(e => e.el)}
                </ul>
              </>
            ) : null}
            <h4>{weeklyNightfallStrikes.headings.scored}</h4>
            <ul className='list activities'>
              {orderBy(
                weeklyNightfallStrikes.activities.scored.map((a, i) => {
                  const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

                  return {
                    light: definitionActivity.activityLightLevel,
                    el: (
                      <li key={i} className='linked tooltip' data-table='DestinyActivityDefinition' data-hash={a.activityHash} data-mode='175275639'>
                        <div className='name'>{definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown')}</div>
                        <div>
                          <div className='time'>{definitionActivity.timeToComplete ? <>{t('{{number}} mins', { number: definitionActivity.timeToComplete || 0 })}</> : null}</div>
                          <div className='light'>
                            <span>{definitionActivity.activityLightLevel}</span>
                          </div>
                        </div>
                      </li>
                    )
                  };
                }),
                [m => m.light],
                ['asc']
              ).map(e => e.el)}
            </ul>
          </>
        ) : (
          <div className='info'>Nightfalls are currently unavailable.</div>
        )}
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withTranslation()
)(VanguardStrikes);
