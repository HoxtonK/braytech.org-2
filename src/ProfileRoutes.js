import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import store from './utils/reduxStore';

import Clan from './views/Clan';
import Character from './views/Character';
import PGCRs from './views/PGCRs';
import Collections from './views/Collections';
import Triumphs from './views/Triumphs';
import Checklists from './views/Checklists';
import ThisWeek from './views/ThisWeek';
import Now from './views/Now';
import Pursuits from './views/Pursuits';

import Header from './components/UI/Header';
import Spinner from './components/UI/Spinner';
import PostmasterCapacity from './components/Notifications/PostmasterCapacity';

class ProfileRoutes extends React.Component {
  componentDidMount() {
    const { membershipId, membershipType, characterId } = this.props.match.params;
    
    store.dispatch({
      type: 'MEMBER_SET_BY_PROFILE_ROUTE',
      payload: { membershipType, membershipId, characterId }
    });
  }

  render() {
    const { member, location, match } = this.props;
    // console.log(member, location, match);

    if (member.error || !member.characterId) {
      // Character select will be able to display the error for us & prompt
      // them to pick a new character / member
      return <Redirect to={{ pathname: '/character-select', state: { from: location } }} />;
    }

    if (!member.data) {
      return (
        <>
          <Route path='/' render={route => <Header route={route} {...this.state} {...this.props} />} />
          <div className='profile-route-loading'>
            <Spinner />
          </div>
        </>
      );
    }

    return (
      <>
        <PostmasterCapacity />
        <Route path='/' render={route => <Header route={route} {...this.state} {...this.props} />} />
        <Switch>
          <Route path={`${match.url}/clan/:view?/:subView?/:subSubView?`} exact render={route => <Clan view={route.match.params.view} subView={route.match.params.subView} subSubView={route.match.params.subSubView} />} />
          <Route path={`${match.url}/checklists`} exact component={Checklists} />
          <Route path={`${match.url}/character`} exact component={Character} />
          <Route path={`${match.url}/collections/:primary?/:secondary?/:tertiary?/:quaternary?/:quinary?`} render={route => <Collections {...route} />} />
          <Route path={`${match.url}/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?`} render={route => <Triumphs {...route} />} />
          <Route path={`${match.url}/this-week`} exact render={route => <ThisWeek />} />
          <Route path={`${match.url}/reports/:type?/:mode?/:offset?`} render={route => <PGCRs {...route} />} />
          <Route path={`${match.url}/now`} exact render={route => <Now />} />
          <Route path={`${match.url}/pursuits/:hash?`} render={route => <Pursuits {...route} />} />
          <Route path={`${match.url}/`} render={route => <Redirect to={{ pathname: `${match.url}/now` }} />} />
        </Switch>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(ProfileRoutes);
