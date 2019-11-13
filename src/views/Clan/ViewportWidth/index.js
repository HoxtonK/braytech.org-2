import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class ViewportWidth extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <>
        <ClanViewsLinks {...this.props} />
        <div className='module'>
          <div className='properties'>
            <div className='name'>{t('Clan Admin')}</div>
            <div className='description'>
              <p>{t('Clan Admin mode is intended for use on larger displays. Please use a display with a viewport of atleast 1280px.')}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default compose(
  connect(),
  withTranslation()
)(ViewportWidth);
