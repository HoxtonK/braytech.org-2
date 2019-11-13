import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { removeMemberIds } from '../../utils/paths';
import { ProfileNavLink } from '../../components/ProfileLink';

class ParentModeLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div className='content views'>
        <ul className='list'>
          <li className='linked'>
            <div className='icon destiny-patrol' />
            <ProfileNavLink to='/reports' isActive={(match, location) => {
                if (['/reports', '/reports/all'].includes(removeMemberIds(location.pathname)) || removeMemberIds(location.pathname).includes('/reports/all')) {
                  return true;
                } else {
                  return false;
                }
              }} />
          </li>
          <li className='linked'>
            <div className='icon destiny-crucible' />
            <ProfileNavLink to='/reports/crucible' />
          </li>
          <li className='linked'>
            <div className='icon destiny-gambit' />
            <ProfileNavLink to='/reports/gambit' />
          </li>
          <li className='linked'>
            <div className='icon destiny-raid' />
            <ProfileNavLink to='/reports/raids' />
          </li>
          <li className='linked'>
            <div className='icon destiny-strike' />
            <ProfileNavLink to='/reports/strikes' />
          </li>
        </ul>
      </div>
    )
  }
}

export default compose(
  connect(),
  withTranslation()
)(ParentModeLinks);
