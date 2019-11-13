import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';

import { ReactComponent as CrucibleIconDefault } from '../../../../media/crucible/svg/default.svg';
import { ReactComponent as CrucibleIconMayhem } from '../../../../media/crucible/svg/mayhem.svg';
import { ReactComponent as CrucibleIconBreakthrough } from '../../../../media/crucible/svg/breakthrough.svg';
import { ReactComponent as CrucibleIconClash } from '../../../../media/crucible/svg/clash.svg';
import { ReactComponent as CrucibleIconShowdown } from '../../../../media/crucible/svg/showdown.svg';
import { ReactComponent as CrucibleIconTeamScorched } from '../../../../media/crucible/svg/team-scorched.svg';
import { ReactComponent as CrucibleIconCountdown } from '../../../../media/crucible/svg/countdown.svg';
import { ReactComponent as CrucibleIconSupremacy } from '../../../../media/crucible/svg/supremacy.svg';
import { ReactComponent as CrucibleIconLockdown } from '../../../../media/crucible/svg/lockdown.svg';
import { ReactComponent as CrucibleIconMomentumControl } from '../../../../media/crucible/svg/momentum-control.svg';
import { ReactComponent as CrucibleIconDoubles } from '../../../../media/crucible/svg/doubles.svg';
import { ReactComponent as CrucibleIconSurvival } from '../../../../media/crucible/svg/elimination.svg';
import { ReactComponent as CrucibleIconIronBanner } from '../../../../media/crucible/svg/iron-banner.svg';

import './styles.css';

const crucibleRotators = [
  // 3753505781, // Iron Banner
  2303927902, // Clash
  3780095688, // Supremacy
  1219083526, // Team Scorched
  4209226441, // Hardware
  952904835, // Momentum Control
  1102379070, // Mayhem
  3011324617, // Breakthrough
  3646079260, // Countdown
  1457072306, // Showdown
  3239164160, // Lockdown
  // 740422335, // Survival
  920826395 // Doubles
];

const crucibleModeIcons = {
  3753505781: <CrucibleIconIronBanner />,
  2303927902: <CrucibleIconClash />,
  3780095688: <CrucibleIconSupremacy />,
  1219083526: <CrucibleIconTeamScorched />,
  4209226441: <CrucibleIconDefault />,
  952904835: <CrucibleIconMomentumControl />,
  1102379070: <CrucibleIconMayhem />,
  3011324617: <CrucibleIconBreakthrough />,
  3646079260: <CrucibleIconCountdown />,
  1457072306: <CrucibleIconShowdown />,
  3239164160: <CrucibleIconLockdown />,
  740422335: <CrucibleIconSurvival />,
  920826395: <CrucibleIconDoubles />
};

class CrucibleRotators extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    // console.log(characterActivities[member.characterId].availableActivities.map(a => {
    //   if (!a.activityHash) return false;
    //   const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

    //   return {
    //     name: definitionActivity.displayProperties.name,
    //     ...a,
    //     definitionActivity
    //   }
    // }));
    
    const featuredCrucibleModes = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;
      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

      if (definitionActivity && crucibleRotators.includes(definitionActivity.hash)) {
        a.displayProperties = definitionActivity.displayProperties;
        a.icon = crucibleModeIcons[definitionActivity.hash] || null;
        return true;
      }

      return false;
    });

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{manifest.DestinyPlaceDefinition[4088006058].displayProperties.name}</div>
        </div>
        <div className='text'>
          <p>
            <em>{t('The following Crucible modes are currently in rotation and available for you to test your vigour in against other Guardians.')}</em>
          </p>
        </div>
        <h4>{t('Rotator playlists')}</h4>
        <div className='activity-mode-icons'>
          {featuredCrucibleModes.map((f, i) => {
            return (
              <div key={i}>
                <div className='icon'>{f.icon}</div>
                <div className='text'>{f.displayProperties.name}</div>
              </div>
            );
          })}
        </div>
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
)(CrucibleRotators);