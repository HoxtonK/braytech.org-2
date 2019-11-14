import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as ls from '../../utils/localStorage';

import Flashpoint from './Modules/Flashpoint';
import HeroicStoryMissions from './Modules/HeroicStoryMissions';
import VanguardStrikes from './Modules/VanguardStrikes';
import BlackArmoryForges from './Modules/BlackArmoryForges';
import DailyVanguardModifiers from './Modules/DailyVanguardModifiers';
import Ranks from './Modules/Ranks';
import SeasonPass from './Modules/SeasonPass';
import SeasonalArtifact from './Modules/SeasonalArtifact';
import Vendor from './Modules/Vendor';
import AuthUpsell from './Modules/AuthUpsell';
import Transitory from './Modules/Transitory';

import './styles.css';

class Now extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.auth = ls.get('setting.auth');
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  render() {
    const { member } = this.props;

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
            mods: [
              {
                className: [],
                component: <DailyVanguardModifiers />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <HeroicStoryMissions />
              }
            ]
          },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <BlackArmoryForges />
              }
            ]
          }
        ]
      },
      {
        className: ['auth-upsell'],
        condition: !this.auth,
        components: [<AuthUpsell key='au' />]
      },
      {
        className: [],
        cols: [
          // {
          //   className: [],
          //   mods: [
          //     {
          //       className: [],
          //       component: <Transitory />
          //     }
          //   ]
          // },
          {
            className: [],
            mods: [
              {
                className: [],
                component: <Ranks />
              }
            ]
          },
          {
            className: ['double'],
            mods: [
              {
                className: ['seasonal-artifact'],
                component: <SeasonalArtifact />
              }
            ]
          }
          // {
          //   className: [],
          //   mods: [
          //     {
          //       className: [],
          //       component: <Vendor hash='2894222926' />
          //     }
          //   ]
          // }
        ]
      },
      {
        className: ['season-pass'],
        components: [<SeasonPass key='sp' />]
      }
    ];

    return (
      <div className='view' id='now'>
        {modules.map((grp, g) => {
          if (grp.components) {
            if (grp.condition === undefined || grp.condition) {
              return (
                <div key={g} className={cx('group', ...grp.className)}>
                  {grp.components}
                </div>
              );
            } else {
              return null;
            }
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
  )
)(Now);
