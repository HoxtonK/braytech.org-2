import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import manifest from '../../../../utils/manifest';

import { ReactComponent as CrucibleIconDefault } from '../../../../media/crucible/svg/default.svg';
import { ReactComponent as CrucibleIconIronBanner } from '../../../../media/crucible/svg/iron-banner.svg';
import { ReactComponent as IconFestivalOfTheLost } from '../../../../media/events/svg/festival-of-the-lost.svg';

import './styles.css';

const featuredActivityHashes = [
  3753505781, // Iron Banner
  1454880421, // Festival of the Lost: Haunted Forest
];

const featuredModeIcons = {
  3753505781: <CrucibleIconIronBanner />,
  1454880421: <IconFestivalOfTheLost />,
};

class FeaturedActivities extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const featuredActivities = characterActivities[member.characterId].availableActivities.filter(a => {
      if (!a.activityHash) return false;
      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

      if (definitionActivity && featuredActivityHashes.includes(definitionActivity.hash)) {
        a.displayProperties = definitionActivity.displayProperties;
        a.icon = featuredModeIcons[definitionActivity.hash] || <CrucibleIconDefault />;
        return true;
      }

      return false;
    });

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{t('Featured activities')}</div>
        </div>
        <div className='text'>
          <p>
            <em>{t('These activities are featured this week. Exploit them for their pinnacle rewards and total joy in the demise of your opponents.')}</em>
          </p>
        </div>
        <h4>{t('Playlists')}</h4>
        <div className='activity-mode-icons featured'>
          {featuredActivities.map((f, i) => {
            return (
              <div key={i}>
                <div className='icon'>{f.icon}</div>
                <div className='text'>
                  <div className='name'>{f.displayProperties.name}</div>
                  <ReactMarkdown className='description' source={f.displayProperties.description} />
                </div>
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
)(FeaturedActivities);
