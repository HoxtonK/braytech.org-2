import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';
import ObservedImage from '../../../../components/ObservedImage';
import Records from '../../../../components/Records';

import './styles.css';

class Reckoning extends React.Component {
  render() {
    const { t, member, cycleInfo } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const rotation = {
      1: {
        boss: t('Likeness of Oryx'),
        triumphs: [2653311362],
        collectibles: []
      },
      2: {
        boss: t('The Swords'),
        triumphs: [2653311362],
        collectibles: []
      }
    };

    const reckoningTierI = characterActivities[member.characterId].availableActivities.find(a => a.activityHash === 3143659188);

    return (
      <React.Fragment key='escalation-protocol'>
        <div className='module-header'>
          <div className='sub-name'>{manifest.DestinyPlaceDefinition[4148998934].displayProperties.name}</div>
          <div className='name'>{rotation[cycleInfo.week.reckoning].boss}</div>
        </div>
        <h4>{t('Active modifiers')}</h4>
        <ul className='list modifiers'>
          {reckoningTierI.modifierHashes.map((hash, h) => {
            const definitionModifier = manifest.DestinyActivityModifierDefinition[hash];

            return (
              <li key={h}>
                <div className='icon'>
                  <ObservedImage className='image' src={`https://www.bungie.net${definitionModifier.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionModifier.displayProperties.name}</div>
                  <div className='description'>{definitionModifier.displayProperties.description}</div>
                </div>
              </li>
            );
          })}
        </ul>
        <h4>{t('Triumphs')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.reckoning].triumphs} ordered />
        </ul>
      </React.Fragment>
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
)(Reckoning);
