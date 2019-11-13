import React from 'react';

import * as ls from '../../../utils/localStorage';
import { NoAuth, DiffProfile } from '../../../components/BungieAuth';
import Spinner from '../../../components/UI/Spinner';
import RosterAdmin from '../../../components/RosterAdmin';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class AdminView extends React.Component {
  auth = ls.get('setting.auth');
  
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  render() {
    const { groupMembers } = this.props;

    if (!this.auth) {
      return <NoAuth />;
    }

    return (
      <>
        <ClanViewsLinks {...this.props} />
        <div className='module'>
          {groupMembers.loading && groupMembers.members.length === 0 ? <Spinner /> : null}
          <div className='status'>{groupMembers.members.length > 0 ? groupMembers.loading ? (
            <Spinner mini />
          ) : (
            <div className='ttl' />
          ) : null}</div>
          {groupMembers.loading && groupMembers.members.length === 0 ? null : <RosterAdmin />}
        </div>
      </>
    );
  }
}

export default AdminView;
