import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy, isEqual, flattenDepth } from 'lodash';

import * as bungie from '../../../utils/bungie';
import getPGCR from '../../../utils/getPGCR';
import Spinner from '../../UI/Spinner';
import Button from '../../UI/Button';

import PGCR from '../PGCR';

import './styles.css';

class Matches extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      cacheState: {},
      instances: []
    };

    this.running = false;
  }

  cacheMachine = async (mode, characterId) => {
    const { member, PGCRcache, limit = 15, offset = 0 } = this.props;

    let charactersIds = characterId ? [characterId] : member.data.profile.characters.data.map(c => c.characterId);

    // console.log(charactersIds)

    let requests = charactersIds.map(async c => {
      let response = await bungie.GetActivityHistory(member.membershipType, member.membershipId, c, limit, mode, offset);

      return (response && response.ErrorCode === 1 && response.Response.activities) || [];
    });

    let activities = await Promise.all(requests);
    activities = flattenDepth(activities, 1);
    activities = orderBy(activities, [pgcr => pgcr.period], ['desc']);
    activities = activities.slice();

    if (this.mounted) {
      this.setState(p => {
        let identifier = mode ? mode : 'all';
        p.cacheState[identifier] = activities.length;
        p.instances = activities.map(a => a.activityDetails.instanceId);
        return p;
      });
    }

    let PGCRs = activities.map(async activity => {
      if (PGCRcache[member.membershipId] && activity && !PGCRcache[member.membershipId].find(pgcr => pgcr.activityDetails.instanceId === activity.activityDetails.instanceId)) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else if (!PGCRcache[member.membershipId] && activity) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else {
        return true;
      }
    });

    return await Promise.all(PGCRs);
  };

  run = async force => {
    const { member, mode } = this.props;

    let run = !this.state.loading;
    if (force) {
      run = true;
    }

    if (run) {
      // console.log('matches refresh start');
      this.running = true;

      if (this.mounted) {
        this.setState(p => {
          p.loading = true;
          return p;
        });
      }

      let ignition = mode
        ? await [mode].map(m => {
            return this.cacheMachine(m, member.characterId);
          })
        : [await this.cacheMachine(false, member.characterId)];

      try {
        await Promise.all(ignition);
      } catch (e) {}

      if (this.mounted) {
        this.setState(p => {
          p.loading = false;
          return p;
        });
      }
      this.running = false;

      // console.log('matches refresh end');
    } else {
      // console.log('matches refresh skipped');
    }
  };

  scrollToMatchesHandler = e => {
    let element = document.getElementById('matches');
    element.scrollIntoView({ behavior: 'smooth' });
  };

  componentDidMount() {
    this.mounted = true;

    this.run();
    this.startInterval();
  }

  componentWillUnmount() {
    this.mounted = false;

    this.clearInterval();
  }

  componentDidUpdate(prev) {
    const { member, mode, offset } = this.props;

    if (prev.member.characterId !== member.characterId) {
      this.run(true);
    }

    if (!isEqual(prev.mode, mode)) {
      this.run(true);
    }

    if (!isEqual(prev.offset, offset)) {
      this.run(true);
    }
  }

  startInterval() {
    this.refreshDataInterval = window.setInterval(this.run, 30000);
  }

  clearInterval() {
    window.clearInterval(this.refreshDataInterval);
  }

  render() {
    const { t, member, PGCRcache, mode, offset, root } = this.props;

    // get PGCRs for current membership
    let PGCRs = PGCRcache[member.membershipId] || [];

    // filter available PGCRs and ensure uniqueness
    PGCRs = PGCRs
      .filter(pgcr => this.state.instances.includes(pgcr.activityDetails.instanceId))
      .filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.activityDetails.instanceId).indexOf(obj.activityDetails.instanceId) === pos;
      });
    
    // ensure order
    PGCRs = orderBy(PGCRs, [pgcr => pgcr.period], ['desc']);

    return PGCRs.length ? (
      <div className='matches'>
        {this.state.loading ? <Spinner mini /> : null}
        <ul className='list reports'>
          {PGCRs.map((r, i) => (
            <PGCR key={r.activityDetails.instanceId} report={r} />
          ))}
        </ul>
        <div className='pages'>
          <Button classNames='previous' text={t('Previous page')} disabled={this.state.loading ? true : offset > 0 ? false : true} anchor to={`/${member.membershipType}/${member.membershipId}/${member.characterId}${root}/${mode ? mode : '-1'}/${offset - 1}`} action={this.scrollToMatchesHandler} />
          <Button classNames='next' text={t('Next page')} disabled={this.state.loading} anchor to={`/${member.membershipType}/${member.membershipId}/${member.characterId}${root}/${mode ? mode : '-1'}/${offset + 1}`} action={this.scrollToMatchesHandler} />
        </div>
      </div>
    ) : (
      <Spinner />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    PGCRcache: state.PGCRcache
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Matches);
