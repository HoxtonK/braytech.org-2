import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';
import ObservedImage from '../../../../components/ObservedImage';

import './styles.css';

class DailyVanguardModifiers extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    // console.log(characterActivities[member.characterId].availableActivities.map(m => ({ name: manifest.DestinyActivityDefinition[m.activityHash].displayProperties.name, ...m })));

    const vanguardStrikes = characterActivities[member.characterId].availableActivities.find(a => a.activityHash === 4252456044);

    const activityNames = [
      {
        hash: 4252456044,
        table: 'DestinyActivityDefinition'
      },
      {
        hash: 3028486709,
        table: 'DestinyPresentationNodeDefinition'
      },
      {
        hash: 175275639,
        table: 'DestinyActivityModeDefinition'
      },
      {
        hash: 1117466231,
        table: 'DestinyPresentationNodeDefinition'
      }
    ]
      .map(l => {
        try {
          if (manifest[l.table][l.hash].displayProperties.name === 'Heroic Adventure') {
            return manifest[l.table][l.hash].displayProperties.name + 's';
          } else {
            return manifest[l.table][l.hash].displayProperties.name;
          }
        } catch (e) {
          return false;
        }
      })
      .map(n => n);

    if (vanguardStrikes) {
      return (
        <>
          <div className='module-header'>
            <div className='sub-name'>{t('Vanguard Ops')}</div>
          </div>
          <div className='text'>
            <p>
              <em>
                {t('Activities including')} {activityNames.join(', ')}.
              </em>
            </p>
          </div>
          <h4>{t('Active modifiers')}</h4>
          <ul className='list modifiers'>
            {vanguardStrikes.modifierHashes.map((hash, h) => {
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
        </>
      );
    } else {
      return <></>;
    }
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
)(DailyVanguardModifiers);
