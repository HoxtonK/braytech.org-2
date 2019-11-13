import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../utils/manifest';
import { ProfileNavLink } from '../../ProfileLink';

import { ReactComponent as CrucibleIconDefault } from '../../../media/crucible/svg/default.svg';
import { ReactComponent as CrucibleIconControl } from '../../../media/crucible/svg/control.svg';
import { ReactComponent as CrucibleIconElimination } from '../../../media/crucible/svg/elimination.svg';
import { ReactComponent as CrucibleIconRumble } from '../../../media/crucible/svg/rumble.svg';
import { ReactComponent as CrucibleIconMayhem } from '../../../media/crucible/svg/mayhem.svg';
import { ReactComponent as CrucibleIconDoubles } from '../../../media/crucible/svg/doubles.svg';
import { ReactComponent as CrucibleIconBreakthrough } from '../../../media/crucible/svg/breakthrough.svg';
import { ReactComponent as CrucibleIconClash } from '../../../media/crucible/svg/clash.svg';
import { ReactComponent as CrucibleIconShowdown } from '../../../media/crucible/svg/showdown.svg';
import { ReactComponent as CrucibleIconTeamScorched } from '../../../media/crucible/svg/team-scorched.svg';
import { ReactComponent as CrucibleIconCountdown } from '../../../media/crucible/svg/countdown.svg';
import { ReactComponent as CrucibleIconSupremacy } from '../../../media/crucible/svg/supremacy.svg';
import { ReactComponent as CrucibleIconLockdown } from '../../../media/crucible/svg/lockdown.svg';
import { ReactComponent as CrucibleIconMomentumControl } from '../../../media/crucible/svg/momentum-control.svg';
import { ReactComponent as CrucibleIconIronBanner } from '../../../media/crucible/svg/iron-banner.svg';

import { ReactComponent as GambitIconGambit } from '../../../media/gambit/svg/gambit.svg';
import { ReactComponent as GambitIconGambitPrime } from '../../../media/gambit/svg/gambit-prime.svg';
import { ReactComponent as GambitIconReckoning } from '../../../media/gambit/svg/reckoning.svg';

import { ReactComponent as VanguardIconStrikes } from '../../../media/vanguard/svg/strikes.svg';
import { ReactComponent as VanguardIconScoredNightfallStrikes } from '../../../media/vanguard/svg/scored-nightfall-strikes.svg';

import { ReactComponent as RaidIcon } from '../../../media/raid/svg/raid.svg';

import './styles.css';

class Mode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, stats, isActive = false, root = '/multiplayer/crucible', defaultMode = 5 } = this.props;

    const definitionActivityMode = Object.values(manifest.DestinyActivityModeDefinition).find(d => d.modeType === stats.mode);

    const modeName = definitionActivityMode && definitionActivityMode.displayProperties.name;
    const modeImage = definitionActivityMode && `https://www.bungie.net${definitionActivityMode.displayProperties.icon}`;

    const modeExtras = [
      // Crucible
      {
        modes: [73],
        icon: <CrucibleIconControl />,
        name: manifest.DestinyActivityDefinition[3176544780].displayProperties.name
      },
      {
        modes: [37],
        icon: <CrucibleIconElimination />
      },
      {
        modes: [48],
        icon: <CrucibleIconRumble />
      },
      {
        modes: [71],
        icon: <CrucibleIconClash />,
        name: manifest.DestinyActivityDefinition[2303927902].displayProperties.name
      },
      {
        modes: [43],
        icon: <CrucibleIconIronBanner />,
        name: manifest.DestinyActivityDefinition[3753505781].displayProperties.name
      },
      {
        modes: [81],
        icon: <CrucibleIconMomentumControl />,
        name: manifest.DestinyActivityDefinition[952904835].displayProperties.name
      },
      {
        modes: [50],
        icon: <CrucibleIconDoubles />
      },
      {
        modes: [31],
        icon: <CrucibleIconSupremacy />
      },
      {
        modes: [60],
        icon: <CrucibleIconLockdown />
      },
      {
        modes: [65],
        icon: <CrucibleIconBreakthrough />
      },
      {
        modes: [59],
        icon: <CrucibleIconShowdown />
      },
      {
        modes: [38],
        icon: <CrucibleIconCountdown />
      },

      // Gambit
      {
        modes: [63],
        icon: <GambitIconGambit />
      },
      {
        modes: [75],
        icon: <GambitIconGambitPrime />
      },
      {
        modes: [76],
        icon: <GambitIconReckoning />
      },

      // Raid
      {
        modes: [4],
        icon: <RaidIcon />
      },

      // Vanfuard
      {
        modes: [18],
        icon: <VanguardIconStrikes />
      },
      {
        modes: [46],
        icon: <VanguardIconScoredNightfallStrikes />
      },

      // Default
      {
        modes: [5],
        icon: <CrucibleIconDefault />
      }
    ];

    const modeExtra = modeExtras.find(m => m.modes.includes(stats.mode));
    
    return (
      <li className='linked'>
        <div className='icon'>
          {modeExtra && modeExtra.icon}
        </div>
        <div className='text'>
          <div className='name'>{(modeExtra && modeExtra.name) || modeName}</div>
          {stats.killsDeathsRatio ? (
            <>
              <div className='minor-stats'>
                <div className='stat'>
                  <div className='name'>{manifest.DestinyHistoricalStatsDefinition['efficiency'].statName}</div>
                  <div className='value'>{Number.parseFloat(stats.efficiency.basic.value).toFixed(2)}</div>
                </div>
                <div className='stat'>
                  <div className='name'>{manifest.DestinyHistoricalStatsDefinition['kills'].statName}</div>
                  <div className='value'>{stats.kills.basic.value.toLocaleString('en-us')}</div>
                </div>
                <div className='stat'>
                  <div className='name'>{manifest.DestinyHistoricalStatsDefinition['deaths'].statName}</div>
                  <div className='value'>{stats.deaths.basic.value.toLocaleString('en-us')}</div>
                </div>
              </div>
              <div className='stat kdr'>
                <div className='name'>K/D</div>
                <div className='value'>{Number.parseFloat(stats.killsDeathsRatio.basic.value).toFixed(2)}</div>
              </div>
            </>
          ) : <div className='no-stats'><div>{t('No stats available')}</div></div>}
        </div>
        <ProfileNavLink isActive={isActive} to={{ pathname: stats.mode === parseInt(defaultMode, 10) ? root : `${root}/${stats.mode}`, state: {  } }} onClick={() => {
          let element = document.getElementById('matches');
          element.scrollIntoView({behavior: "smooth"});
        }} />
      </li>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Mode);
