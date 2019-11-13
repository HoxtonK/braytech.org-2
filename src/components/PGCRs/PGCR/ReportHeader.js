import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import Moment from 'react-moment';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

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

import { ReactComponent as CrucibleIconStandingVictory } from '../../../media/crucible/svg/standing-victory.svg';
import { ReactComponent as CrucibleIconStandingDefeat } from '../../../media/crucible/svg/standing-defeat.svg';

class ReportHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { characterIds, activityDetails, period, entries } = this.props;

    const modeExtras = [
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
      {
        modes: [5],
        icon: <CrucibleIconDefault />
      }
    ];

    const modeExtra = modeExtras.find(m => m.modes.includes(activityDetails.mode));

    const definitionMode = Object.values(manifest.DestinyActivityModeDefinition).find(d => d.modeType === activityDetails.mode);

    const modeName = definitionMode && definitionMode.displayProperties.name;

    const map = manifest.DestinyActivityDefinition[activityDetails.referenceId];
    

    const entry = entries && ((characterIds && entries.find(entry => characterIds.includes(entry.characterId))) || (entries.length && orderBy(entries, [e => e.values && e.values.activityDurationSeconds && e.values.activityDurationSeconds.basic.value], ['desc'])[0]));

    const realEndTime = moment(period).add(entry.values.activityDurationSeconds.basic.value, 'seconds');


    return (
      <div className='basic'>
        <div className='mode'>{(modeExtra && modeExtra.name) || modeName}</div>
        <div className='map'>{map && map.displayProperties.name}</div>
        <div className='ago'>
          <Moment fromNow>{realEndTime}</Moment>
        </div>
      </div>
    );

  }
}

class ReportHeaderLarge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, characterIds, activityDetails, period, entries, teams } = this.props;

    const modeExtras = [
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
      {
        modes: [5],
        icon: <CrucibleIconDefault />
      }
    ];

    const modeExtra = modeExtras.find(m => m.modes.includes(activityDetails.mode));

    const definitionMode = Object.values(manifest.DestinyActivityModeDefinition).find(d => d.modeType === activityDetails.mode);

    const modeName = definitionMode && definitionMode.displayProperties.name;

    const map = manifest.DestinyActivityDefinition[activityDetails.referenceId];

    const entry = entries && ((characterIds && entries.find(entry => characterIds.includes(entry.characterId))) || (entries.length && orderBy(entries, [e => e.values && e.values.activityDurationSeconds && e.values.activityDurationSeconds.basic.value], ['desc'])[0]));

    const realEndTime = moment(period).add(entry.values.activityDurationSeconds.basic.value, 'seconds');

    const standing = entry.values.standing && entry.values.standing.basic.value !== undefined ? entry.values.standing.basic.value : -1;
    const scoreTotal = entry.values.score ? entries.reduce((v, e) => v + e.values.score.basic.value, 0) : false;

    let alpha = teams && teams.length ? teams.find(t => t.teamId === 17) : false;
    let bravo = teams && teams.length ? teams.find(t => t.teamId === 18) : false;
    let score;
    if (teams && teams.length && alpha && bravo) {
      score = (
        <>
          <div className={cx('value', 'alpha', { victory: teams.find(t => t.teamId === 17 && t.standing.basic.value === 0) })}>{alpha.score.basic.displayValue}</div>
          <div className={cx('value', 'bravo', { victory: teams.find(t => t.teamId === 18 && t.standing.basic.value === 0) })}>{bravo.score.basic.displayValue}</div>
        </>
      );
    }

    // const standingExtras = [
    //   {
    //     mode: 1164760504,
    //     defeat: 
    //   }
    // ]

    // const standingExtra = standingExtras.find(m => m.modes.includes(activityDetails.mode));

    return (
      <div className='head'>
      {map && map.pgcrImage && <ObservedImage className='image bg' src={`https://www.bungie.net${map.pgcrImage}`} />}
      <div className='detail'>
        <div>
          <div className='map'>{map && map.displayProperties.name}</div>
          <div className='mode'>{(modeExtra && modeExtra.name) || modeName}</div>
        </div>
        <div>
          <div className='duration'>{entry.values.activityDurationSeconds.basic.displayValue}</div>
          <div className='ago'>
            <Moment fromNow>{realEndTime}</Moment>
          </div>
        </div>
      </div>
      {standing > -1 ? (
        <>
          <div className='standing'>
            <div className='icon crucible'>{standing === 0 ? <CrucibleIconStandingVictory /> : <CrucibleIconStandingDefeat />}</div>
            <div className='text'>{standing === 0 ? t('Victory') : t('Defeat')}</div>
          </div>
          <div className='score teams'>{score}</div>
        </>
      ) : null}
      {scoreTotal && standing < 0 ? (
        <>
          <div className='score'>{scoreTotal.toLocaleString('en-us')}</div>
        </>
      ) : null}
    </div>
    );

  }
}

ReportHeader = compose(withTranslation())(ReportHeader);

ReportHeaderLarge = compose(withTranslation())(ReportHeaderLarge);

export { ReportHeader, ReportHeaderLarge };