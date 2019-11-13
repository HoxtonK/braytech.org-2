import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import * as bungie from '../../../utils/bungie';
import manifest from '../../../utils/manifest';
import Spinner from '../../../components/UI/Spinner';
import Mode from '../../../components/PGCRs/Mode';
import Matches from '../../../components/PGCRs/Matches';
import ParentModeLinks from '../ParentModeLinks';

class Crucible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  crucible = {
    all: {
      allPvP: {
        mode: 5
      }
    },
    core: {
      controlQuickplay: {
        mode: 73
      },
      survival: {
        mode: 37
      },
      rumble: {
        mode: 48
      }
    },
    rotator: {
      clashQuickplay: {
        mode: 71
      },
      ironBannerControl: {
        mode: 43
      },
      momentum: {
        mode: 81
      },
      doubles: {
        mode: 50
      },
      supremacy: {
        mode: 31
      },
      lockdown: {
        mode: 60
      },
      breakthrough: {
        mode: 65
      },
      showdown: {
        mode: 59
      },
      countdown: {
        mode: 38
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

    let [stats_allPvP, stats_core, stats_rotator] = await Promise.all([bungie.GetHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', Object.values(this.crucible.all).map(m => m.mode), '0'), bungie.GetHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', Object.values(this.crucible.core).map(m => m.mode), '0'), bungie.GetHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', Object.values(this.crucible.rotator).map(m => m.mode), '0')]);

    stats_allPvP = (stats_allPvP && stats_allPvP.ErrorCode === 1 && stats_allPvP.Response) || [];
    stats_core = (stats_core && stats_core.ErrorCode === 1 && stats_core.Response) || [];
    stats_rotator = (stats_rotator && stats_rotator.ErrorCode === 1 && stats_rotator.Response) || [];

    for (const mode in stats_allPvP) {
      if (stats_allPvP.hasOwnProperty(mode)) {
        if (!stats_allPvP[mode].allTime) {
          return;
        }
        Object.entries(stats_allPvP[mode].allTime).forEach(([key, value]) => {
          this.crucible.all[mode][key] = value;
        });
      }
    }

    for (const mode in stats_core) {
      if (stats_core.hasOwnProperty(mode)) {
        if (!stats_core[mode].allTime) {
          return;
        }
        Object.entries(stats_core[mode].allTime).forEach(([key, value]) => {
          this.crucible.core[mode][key] = value;
        });
      }
    }

    for (const mode in stats_rotator) {
      if (stats_rotator.hasOwnProperty(mode)) {
        if (!stats_rotator[mode].allTime) {
          return;
        }
        Object.entries(stats_rotator[mode].allTime).forEach(([key, value]) => {
          this.crucible.rotator[mode][key] = value;
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

    const offset = parseInt(this.props.offset);

    return (
      <div className={cx('view', 'crucible')} id='multiplayer'>
        <div className='module-l1'>
          <div className='module-l2'>
            <div className='content head'>
              <div className='page-header'>
                <div className='sub-name'>{t('Post Game Carnage Reports')}</div>
                <div className='name'>{t('Crucible')}</div>
              </div>
            </div>
          </div>
          <div className='module-l2'>
            <ParentModeLinks />
          </div>
          <div className='module-l2'>
            {/* <div className='sub-header'>
              <div>{t('Summative modes')}</div>
            </div>
            <div className='content'>
              {Object.values(this.crucible.all.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.crucible.all).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} root='/reports/crucible' />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div> */}
            <div className='sub-header'>
              <div>{t('Core modes')}</div>
            </div>
            <div className='content'>
              {Object.values(this.crucible.all.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.crucible.core).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} root='/reports/crucible' />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
            <div className='sub-header'>
              <div>{t('Rotator modes')}</div>
            </div>
            <div className='content'>
              {Object.values(this.crucible.all.allPvP).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.crucible.rotator).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 5;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} root='/reports/crucible' />;
                  })}
                </ul>
              ) : (
                <Spinner mini />
              )}
            </div>
          </div>
        </div>
        <div className='module-l1' id='matches'>
          <div className='sub-header'>
            <div>{t('Recent matches')}</div>
          </div>
          <div className='content'>
            <Matches mode={this.props.mode ? parseInt(this.props.mode) : 5} limit='20' offset={offset} root='/reports/crucible' />
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
)(Crucible);
