import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';

import manifest from '../../../../utils/manifest';

import './styles.css';

class HeroicStoryMissions extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const knownStoryActivities = [129918239, 271962655, 589157009, 1023966646, 1070049743, 1132291813, 1259766043, 1313648352, 1513386090, 1534123682, 1602328239, 1872813880, 1882259272, 1906514856, 2000185095, 2146977720, 2568845238, 2660895412, 2772894447, 2776154899, 3008658049, 3205547455, 3271773240, 4009655461, 4234327344, 4237009519, 4244464899, 2962137994];
    const dailyHeroicStoryActivities = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;

      if (!knownStoryActivities.includes(a.activityHash)) return false;

      return true;
    });
    const dailyHeroicStories = {
      activities: dailyHeroicStoryActivities,
      displayProperties: {
        name: manifest.DestinyPresentationNodeDefinition[3028486709] && manifest.DestinyPresentationNodeDefinition[3028486709].displayProperties && manifest.DestinyPresentationNodeDefinition[3028486709].displayProperties.name
      }
    };

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{dailyHeroicStories.displayProperties.name}</div>
        </div>
        <ul className='list activities'>
          {orderBy(
            dailyHeroicStories.activities.map((a, i) => {
              const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

              return {
                light: definitionActivity.activityLightLevel,
                timeToComplete: definitionActivity.timeToComplete || 20,
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
            [m => m.timeToComplete],
            ['asc']
          ).map(e => e.el)}
        </ul>
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
)(HeroicStoryMissions);
