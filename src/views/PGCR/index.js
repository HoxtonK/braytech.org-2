import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../utils/manifest';
import getPGCR from '../../utils/getPGCR';

import { ReportItem } from '../../components/PGCRs/PGCR';
import Spinner from '../../components/UI/Spinner';

import './styles.css';

class PGCR extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.init();

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  init = async () => {
    const { member, match } = this.props;
    const { instanceId } = match.params;

    const membershipId = (member && member.membershipId) || '343';

    const result = await this.getReport(membershipId, instanceId);

    console.log(result);

    if (this.mounted) {
      this.setState(p => ({
        loading: false,
        membershipId
      }));
    }
  };

  getReport = async (membershipId, instanceId) => {
    const { PGCRcache } = this.props;

    if (PGCRcache[membershipId] && !PGCRcache[membershipId].find(pgcr => pgcr.activityDetails.instanceId === instanceId)) {
      return getPGCR(membershipId, instanceId);
    } else if (!PGCRcache[membershipId] && instanceId) {
      return getPGCR(membershipId, instanceId);
    } else {
      ////////// ??
      return true;
    }
  };

  render() {
    const { t, PGCRcache, match } = this.props;
    const { instanceId } = match.params;

    const { loading, membershipId } = this.state;

    const report = !loading && PGCRcache[membershipId] && PGCRcache[membershipId].find(pgcr => pgcr.activityDetails.instanceId === instanceId);

    console.log(report);

    if (loading) {
      return (
        <div className='view loading' id='pgcr'>
          <Spinner />
        </div>
      );
    } else if (report) {
      return (
        <div className='view' id='pgcr'>
          <ul className='list reports'>
            <ReportItem report={report} expanded />
          </ul>
        </div>
      );
    } else {
      return (
        <div className='view' id='pgcr'>
          error
        </div>
      );
    }
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
)(PGCR);
