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

class Gambit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  gambit = {
    all: {
      pvecomp_mamba: {
        mode: 75
      },
      pvecomp_gambit: {
        mode: 63
      },
      enigma: {
        mode: 76
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

    let stats = await bungie.GetHistoricalStats(member.membershipType, member.membershipId, member.characterId, '1', Object.values(this.gambit.all).map(m => m.mode), '0');

    stats = (stats && stats.ErrorCode === 1 && stats.Response) || [];

    for (const mode in stats) {
      if (stats.hasOwnProperty(mode)) {
        if (!stats[mode].allTime) {
          return;
        }
        Object.entries(stats[mode].allTime).forEach(([key, value]) => {
          this.gambit.all[mode][key] = value;
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
      <div className={cx('view', 'gambit')} id='multiplayer'>
        <div className='module-l1'>
          <div className='module-l2'>
            <div className='content head'>
              <div className='page-header'>
                <div className='sub-name'>{t('Post Game Carnage Reports')}</div>
                <div className='name'>{t('Gambit')}</div>
              </div>
            </div>
          </div>
          <div className='module-l2'>
            <ParentModeLinks />
          </div>
          <div className='module-l2'>
            <div className='content'>
              {Object.values(this.gambit.all.pvecomp_gambit).length > 1 ? (
                <ul className='list modes'>
                  {Object.values(this.gambit.all).map(m => {
                    let paramsMode = this.props.mode ? parseInt(this.props.mode) : 75;
                    let isActive = (match, location) => {
                      if (paramsMode === m.mode) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return <Mode key={m.mode} stats={m} isActive={isActive} root='/reports/gambit' defaultMode='75' />;
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
              <div>{t('Recent matches')}</div>
            </div>
            <Matches mode={this.props.mode ? parseInt(this.props.mode) : 75} limit='20' offset={offset} root='/reports/gambit' />
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
)(Gambit);
