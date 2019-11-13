import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import './styles.css';

class NoClan extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className='view no-clan' id='clan'>
        <div className='module'>
          <div className='properties'>
            <div className='name'>{t('No clan affiliation')}</div>
            <div className='description'>
              <p>{t('Clans are optional groups of friends that enhance your online gaming experience. Coordinate with your clanmates to take on co-op challenges or just simply represent them in your solo play to earn extra rewards.')}</p>
              <p>{t("Join your friend's clan, meet some new friends, or create your own on the companion app or at bungie.net.")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(),
  withTranslation()
)(NoClan);
