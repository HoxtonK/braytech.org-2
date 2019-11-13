import React from 'react';

import Spinner from '../../../components/UI/Spinner';
import Roster from '../../../components/Roster';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class RosterView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  render() {
    const { groupMembers } = this.props;

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
          {groupMembers.loading && groupMembers.members.length === 0 ? null : <Roster />}
        </div>
      </>
    );
  }
}

export default RosterView;
