import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import Flashpoint from './Modules/Flashpoint';
import FeaturedActivities from './Modules/FeaturedActivities';
import CrucibleRotators from './Modules/CrucibleRotators';
import Nightfalls from './Modules/Nightfalls';
import Menagerie from './Modules/Menagerie';
import Raids from './Modules/Raids';
import DreamingCityAscendantChallenge from './Modules/DreamingCityAscendantChallenge';
import DreamingCityCurse from './Modules/DreamingCityCurse';
import DreamingCityShatteredThrone from './Modules/DreamingCityShatteredThrone';
import EscalationProtocol from './Modules/EscalationProtocol';
import Reckoning from './Modules/Reckoning';

import './styles.css';

class ThisWeek extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  render() {
    const { member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    const resetTime = '17:00:00Z';

    const cycleInfo = {
      epoch: {
        // start of cycle in UTC
        ascendant: new Date(`2018-09-04T${resetTime}`).getTime(),
        curse: new Date(`2018-09-11T${resetTime}`).getTime(),
        ep: new Date(`2018-05-08T${resetTime}`).getTime(),
        reckoning: new Date(`2019-05-21T${resetTime}`).getTime(),
        whisper: new Date(`2019-05-28T${resetTime}`).getTime(),
        zerohour: new Date(`2019-05-28T${resetTime}`).getTime(),
        menagerie: new Date(`2019-06-04T${resetTime}`).getTime()
      },
      cycle: {
        // how many week cycle
        ascendant: 6,
        curse: 3,
        ep: 5,
        reckoning: 2,
        whisper: 3,
        zerohour: 3,
        menagerie: 3
      },
      elapsed: {}, // elapsed time since cycle started
      week: {} // current week in cycle
    };

    const time = new Date().getTime();
    const msPerWk = 604800000;

    for (var cycle in cycleInfo.cycle) {
      cycleInfo.elapsed[cycle] = time - cycleInfo.epoch[cycle];
      cycleInfo.week[cycle] = Math.floor((cycleInfo.elapsed[cycle] / msPerWk) % cycleInfo.cycle[cycle]) + 1;
    }

    const modules = [
      {
        className: ['head'],
        cols: [
          {
            className: [],
            mods: [
              {
                className: [],
                component: <Flashpoint />
              }
            ]
          },
          {
            className: [],
            condition: characterActivities[member.characterId].availableActivities.filter(a => [3753505781, 1454880421].includes(a.activityHash)).length,
            mods: [
              {
                className: [],
                component: <FeaturedActivities />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <CrucibleRotators />
              }
            ]
          }
        ]
      },
      {
        className: [],
        components: [<Nightfalls key='nf' />]
      },
      {
        className: [],
        components: [<Raids key='ra' />]
      },
      {
        className: [],
        cols: [
          {
            className: [],
            mods: [
              {
                className: [],
                component: <DreamingCityAscendantChallenge cycleInfo={cycleInfo} />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <DreamingCityCurse cycleInfo={cycleInfo} />
              }
            ]
          },
          {
            className: ['shattered-throne'],
            mods: [
              {
                className: [],
                component: <DreamingCityShatteredThrone cycleInfo={cycleInfo} />
              }
            ]
          }
        ]
      },
      {
        className: [],
        cols: [
          {
            className: [],
            mods: [
              {
                className: [],
                component: <Menagerie cycleInfo={cycleInfo} />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <Reckoning cycleInfo={cycleInfo} />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <EscalationProtocol cycleInfo={cycleInfo} />
              }
            ]
          }
        ]
      }
    ];

    return (
      <div className='view' id='this-week'>
        {modules.map((grp, g) => {
          if (grp.components) {
            return (
              <div key={g} className={cx('group', ...grp.className)}>
                {grp.components}
              </div>
            );
          } else {
            return (
              <div key={g} className={cx('group', ...grp.className)}>
                {grp.mods
                  ? grp.mods.map((mod, m) => {
                      return (
                        <div key={m} className={cx('module', ...mod.className)}>
                          {mod.component}
                        </div>
                      );
                    })
                  : grp.cols
                      .map((col, c) => {
                        if (col.condition === undefined || col.condition) {
                          return (
                            <div key={c} className={cx('column', ...col.className)}>
                              {col.mods.map((mod, m) => {
                                return (
                                  <div key={m} className={cx('module', ...mod.className)}>
                                    {mod.component}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        } else {
                          return false;
                        }
                      })
                      .map(c => c)}
              </div>
            );
          }
        })}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(ThisWeek);
