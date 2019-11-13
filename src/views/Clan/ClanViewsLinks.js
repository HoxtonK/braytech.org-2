import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { ProfileNavLink } from '../../components/ProfileLink';

class ClanViewsLinks extends React.Component {
  render() {
    return (
      <div className='module views'>
        <ul className='list'>
          <li className='linked'>
            <div className='icon about' />
            <ProfileNavLink to='/clan' exact />
          </li>
          <li className='linked'>
            <div className='icon stats' />
            <ProfileNavLink to='/clan/stats' />
          </li>
          <li className='linked'>
            <div className='icon roster' />
            <ProfileNavLink to='/clan/roster' />
          </li>
          <li className='linked'>
            <div className='icon admin' />
            <ProfileNavLink to='/clan/admin' />
          </li>
        </ul>
      </div>
    );
  }
}

export default compose(
  connect(),
  withTranslation()
)(ClanViewsLinks);
