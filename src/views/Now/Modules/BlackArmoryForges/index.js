import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';

import { ReactComponent as ForgeGofannon } from './icons/gofannon.svg';
import { ReactComponent as ForgeIzanami } from './icons/izanami.svg';
import { ReactComponent as ForgeBerguisa } from './icons/bergusia.svg';
import { ReactComponent as ForgeVolundr } from './icons/volundr.svg';

import './styles.css';

const forgeIcons = {
  957727787: <ForgeGofannon />,
  2656947700: <ForgeIzanami />,
  1434072700: <ForgeBerguisa />,
  1506080581: <ForgeVolundr />
};

class BlackArmoryForges extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const dailyBlackArmoryForges = {
      active: characterActivities[member.characterId].availableActivities.find(a => {
        const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

        if (definitionActivity && definitionActivity.activityTypeHash === 838603889) {
          return true;
        } else {
          return false;
        }
      })
    };

    if (!dailyBlackArmoryForges.active) return null;

    const definitionActivity = manifest.DestinyActivityDefinition[dailyBlackArmoryForges.active.activityHash];

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{t('Black Armory Forges')}</div>
        </div>
        <div className='text'>
          <p>
            <em>{t('Forges are currently running in low-power mode and will only be available during maintenance periods.')}</em>
          </p>
        </div>
        <h4>{t('Active')}</h4>
        <div className='activity-mode-icons'>
          <div>
            <div className='icon'>{forgeIcons[dailyBlackArmoryForges.active.activityHash] ? forgeIcons[dailyBlackArmoryForges.active.activityHash] : null}</div>
            <div className='text'>{definitionActivity.displayProperties.name}</div>
          </div>
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
  connect(mapStateToProps),
  withTranslation()
)(BlackArmoryForges);
