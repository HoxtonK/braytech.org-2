import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import * as bungie from '../../../utils/bungie';

import Spinner from '../../../components/UI/Spinner';
import Mode from '../../../components/PGCRs/Mode';
import Matches from '../../../components/PGCRs/Matches';
import ParentModeLinks from '../ParentModeLinks';

class Strikes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  strikes = {
    all: {
      allStrikes: {
        mode: 18
      },
      scored_nightfall: {
        mode: 46
      }
    }
  };

  fetch = async () => {
    const { member } = this.props;

    if (this.mounted) {
      this.setState(p => ({
        ...p,
        loading: true
      }));
    }

    let stats = await bungie.GetHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', Object.values(this.strikes.all).map(m => m.mode), '0');

    stats = (stats && stats.ErrorCode === 1 && stats.Response) || [];

    for (const mode in stats) {
      if (stats.hasOwnProperty(mode)) {
        if (!stats[mode].allTime) {
          return;
        }
        Object.entries(stats[mode].allTime).forEach(([key, value]) => {
          this.strikes.all[mode][key] = value;
        });
      }
    }

    if (this.mounted) {
      this.setState(p => ({
        ...p,
        loading: false
      }));
    }

    return true;
  };

  componentDidMount() {
    this.mounted = true;

    this.refreshData();
    this.startInterval();
  }

  componentWillUnmount() {
    this.mounted = false;

    this.clearInterval();
  }

  refreshData = async () => {
    if (!this.state.loading) {
      //console.log('refresh start');
      await this.fetch();
      //console.log('refresh end');
    } else {
      //console.log('refresh skipped');
    }
  };

  startInterval() {
    this.refreshDataInterval = window.setInterval(this.refreshData, 30000);
  }

  clearInterval() {
    window.clearInterval(this.refreshDataInterval);
  }

  render() {
    const { t } = this.props;

    const mode = this.props.mode ? parseInt(this.props.mode) : 18;
    const offset = parseInt(this.props.offset);

    return (
      <div className={cx('view', 'strikes')} id='multiplayer'>
        <div className='module-l1'>
          <div className='module-l2'>
            <div className='content head'>
              <div className='page-header'>
                <div className='sub-name'>{t('Post Game Carnage Reports')}</div>
                <div className='name'>{t('Strikes')}</div>
              </div>
            </div>
          </div>
          <div className='module-l2'>
            <ParentModeLinks />
          </div>
          <div className='module-l2'>
            <div className='content'>
              {Object.values(this.strikes.all.allStrikes).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.strikes.all).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 18;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} root='/reports/strikes' defaultMode='18' />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
          </div>
        </div>
        <div className='module-l1' id='matches'>
          <div className='content'>
            <div className='sub-header'>
              <div>{t('Recent strikes')}</div>
            </div>
            <Matches mode={mode} limit='20' offset={offset} root='/reports/strikes' />
          </div>
        </div>
      </div>
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
)(Strikes);
