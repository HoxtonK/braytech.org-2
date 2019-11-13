import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { BungieAuthButton } from '../../../../components/BungieAuth';

import './styles.css';

class AuthUpsell extends React.Component {
  render() {
    const { t, member } = this.props;

    return (
      <div className='wrap'>
        <div className='headline'>{t('Hey {{displayName}}, did you know you can authenticate Braytech with Bungie.net for access to more features', { displayName: member.data.profile.profile.data.userInfo.displayName })}</div>
        <div className='text'>
          <p>{t("Most of Braytech's features are available to all users and depend on publically available data, but some of Destiny's features require more explicit access permissions which you can grant to Braytech by authenticating with Bungie.net.")}</p>
          <ul className='feature-sell'>
            <li>
              <div className='icon pursuits' />
              <div className='text'>
                <div className='name'>{t('Pursuits')}</div>
                <div className='description'>
                  <p>{t('Quests and bounties, step by step, reward by reward')}</p>
                </div>
              </div>
            </li>
            <li>
              <div className='icon artifact' />
              <div className='text'>
                <div className='name'>{t('Seasonal Artifact')}</div>
                <div className='description'>
                  <p>{t('Review your unlocks and monitor your progress')}</p>
                </div>
              </div>
            </li>
            <li>
              <div className='icon admin' />
              <div className='text'>
                <div className='name'>{t('Clan Admin')}</div>
                <div className='description'>
                  <p>{t('Minimal though powerful clan management for rapid sorting and member actions')}</p>
                </div>
              </div>
            </li>
            <li>
              <div className='icon inventory' />
              <div className='text'>
                <div className='name'>{t('Inventory')}</div>
                <div className='description'>
                  <p>{t('Get helpful reminders regarding your soon to be overflowing postmaster')}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <BungieAuthButton />
      </div>
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
)(AuthUpsell);
