import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import './styles.css';

import About from './About';
import Roster from './Roster';
import Stats from './Stats';
import Admin from './Admin';
import NoClan from './NoClan';
import ViewportWidth from './ViewportWidth';

class Clan extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { member, viewport } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    if (group) {

      let view = this.props.view || 'about';

      let views = {
        'about': {
          'name': 'about',
          'component': About
        },
        'roster': {
          'name': 'roster',
          'component': Roster
        },
        'stats': {
          'name': 'stats',
          'component': Stats
        },
        'admin': {
          'name': viewport.width >= 1280 ? 'admin' : 'viewport-width',
          'component': viewport.width >= 1280 ? Admin : ViewportWidth
        }
      };

      if (!views[view]) view = 'about';

      let ViewComponent = views[view].component;

      return (
        <div className={cx('view', views[view].name)} id='clan'>
          <ViewComponent {...this.props} group={group} />
        </div>
      )
    } else {
      return <NoClan />
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    groupMembers: state.groupMembers
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Clan);
