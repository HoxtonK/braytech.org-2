import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import * as entities from 'entities';

import manifest from '../../utils/manifest';
import * as bungie from '../../utils/bungie';
import * as responseUtils from '../../utils/responseUtils';
import * as utils from '../../utils/destinyUtils';
import userFlair from '../../data/userFlair';
import store from '../../utils/reduxStore';
import ObservedImage from '../ObservedImage';
import Spinner from '../UI/Spinner';
import { Button, DestinyKey } from '../UI/Button';
import Flair from '../UI/Flair';
import Ranks from '../Ranks';

import './styles.css';

class MemberLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basic: {
        loading: true,
        data: false,
        error: false
      },
      all: {
        loading: false,
        data: false,
        error: false
      },
      voluspa: {
        loading: true,
        data: false,
        error: false
      },
      overlay: false
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidMount() {
    this.mounted = true;

    const { type, id, displayName = false } = this.props;

    if (this.mounted) {
      try {
        let response = await bungie.GetProfile({
          params: {
            membershipType: type,
            membershipId: id,
            components: displayName ? '200': '100,200'
          }
        });

        if (response && response.ErrorCode === 1) {
          let profile = responseUtils.profileScrubber(response.Response, 'activity');

          if (!profile.characters.data || (profile.characters.data && profile.characters.data.length === 0)) {
            this.setState(p => ({
              ...p,
              all: {
                ...p.all,
                error: true
              }
            }));
          } else {
            this.setState(p => ({
              ...p,
              basic: {
                ...p.basic,
                data: profile,
                loading: false,
                error: false
              }
            }));
          }
        } else {
          throw Error;
        }
      } catch (e) {}
    }
  }

  getFullProfileData = async () => {
    const { type, id } = this.props;

    if (this.mounted) {
      try {
        let requests = [bungie.GetProfile({
          params: {
            membershipType: type,
            membershipId: id,
            components: '100,200,202,204,205,800,900'
          }
        }), bungie.GetGroupsForMember({
          params: {
            membershipType: type,
            membershipId: id
          }
        })];

        let [profile, group] = await Promise.all(requests);

        if (profile && profile.ErrorCode === 1) {
          profile = responseUtils.profileScrubber(profile.Response, 'activity');

          if (!profile.profileRecords.data || (profile.profileRecords.data && Object.entries(profile.profileRecords.data.records).length === 0)) {
            this.setState(p => ({
              ...p,
              all: {
                ...p.all,
                error: true
              }
            }));
          } else {
            let data = {
              ...profile,
              group: group && group.ErrorCode === 1 && group.Response.results.length ? group.Response.results[0].group : false
            };

            // console.log(data);

            this.setState(p => ({
              ...p,
              all: {
                ...p.all,
                error: false,
                data: data,
                loading: false
              }
            }));
          }
        } else {
          throw Error;
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  activateOverlay = async e => {
    e.stopPropagation();

    this.setState((prevState, props) => {
      prevState.overlay = true;
      return prevState;
    });

    this.getFullProfileData();
  };

  deactivateOverlay = e => {
    e.stopPropagation();
    if (this.mounted) {
      this.setState((prevState, props) => {
        prevState.overlay = false;
        return prevState;
      });
    }
  };

  render() {
    const { t, type, id, displayName = false, characterId, hideFlair = false, showClassIcon = false, hideEmblemIcon = false } = this.props;

    let characterBasic;
    if (this.state.basic.data) {
      if (characterId) {
        characterBasic = this.state.basic.data.characters.data.find(c => c.characterId === characterId);
        if (!characterBasic) characterBasic = this.state.basic.data.characters.data[0];
      } else {
        characterBasic = this.state.basic.data.characters.data[0];
      }
    }

    const flair = userFlair.find(f => f.user === type + id);
    const primaryFlair = flair && flair.trophies.find(t => t.primary);

    if (this.state.overlay && this.state.all.data) {
      const timePlayed = Math.floor(
        Object.keys(this.state.all.data.characters.data).reduce((sum, key) => {
          return sum + parseInt(this.state.all.data.characters.data[key].minutesPlayedTotal);
        }, 0) / 1440
      );

      const lastCharacterPlayedArr = Object.entries(this.state.all.data.characterActivities.data).sort((a, b) => {
        let x = new Date(a[1].dateActivityStarted).getTime();
        let y = new Date(b[1].dateActivityStarted).getTime();

        return y - x;
      });

      const lastCharacterPlayed = lastCharacterPlayedArr.length ? lastCharacterPlayedArr[0][0] : lastCharacterPlayedArr;
      const lastActivities = utils.lastPlayerActivity({ profile: { characters: this.state.all.data.characters, characterActivities: this.state.all.data.characterActivities } });

      return (
        <>
          <div className='member-link' onClick={this.activateOverlay}>
            {!hideFlair && primaryFlair ? (
              <div className={cx('user-flair', primaryFlair.classnames)}>
                <i className={primaryFlair.icon} />
              </div>
            ) : null}
            <div className='emblem'>
              {!this.state.basic.loading && this.state.basic.data ? (
                showClassIcon ? (
                  <div className='icon'>
                    <i
                      className={`destiny-class_${utils
                        .classTypeToString(characterBasic.classType)
                        .toString()
                        .toLowerCase()}`}
                    />
                  </div>
                ) : !hideEmblemIcon ? (
                  <ObservedImage className='image' src={`https://www.bungie.net${characterBasic.emblemPath}`} />
                ) : null
              ) : null}
            </div>
            <div className='displayName'>{displayName ? displayName : !this.state.basic.loading && this.state.basic.data ? this.state.basic.data.profile.data.userInfo.displayName : null}</div>
          </div>
          <div id='member-overlay' className={cx({ error: this.state.all.error })}>
            <div className='wrapper-outer'>
              <div className='background'>
                <div className='border-top' />
                <div className='acrylic' />
              </div>
              <div className={cx('wrapper-inner')}>
                {!this.state.all.loading && this.state.all.data && !this.state.all.error ? (
                  <>
                    <div className='module'>
                      <div className='names'>
                        <div className='displayName'>{this.state.all.data.profile.data && this.state.all.data.profile.data.userInfo.displayName}</div>
                        <div className='groupName'>{this.state.all.data.group ? entities.decodeHTML(this.state.all.data.group.name) : null}</div>
                        <Flair type={type} id={id} />
                      </div>
                      <div className='basics'>
                        <div>
                          <div className='name'>{t('Season rank')}</div>
                          <div className='value'>{utils.progressionSeasonRank({ characterId: lastCharacterPlayed, data: { profile: this.state.all.data } }).level}</div>
                        </div>
                        <div>
                          <div className='name'>{t('Time played across characters')}</div>
                          <div className='value'>
                            {timePlayed} {timePlayed === 1 ? t('day played') : t('days played')}
                          </div>
                        </div>
                        <div>
                          <div className='name'>{t('Triumph score')}</div>
                          <div className='value'>{this.state.all.data.profileRecords.data.score.toLocaleString('en-us')}</div>
                        </div>
                        <div>
                          <div className='name'>{t('Collection total')}</div>
                          <div className='value'>{utils.collectionTotal(this.state.all.data).toLocaleString('en-us')}</div>
                        </div>
                      </div>
                    </div>
                    <div className='module'>
                      <div className='sub-header'>
                        <div>{t('Characters')}</div>
                      </div>
                      <div className='characters'>
                        {this.state.all.data.characters.data.map(c => {
                          const lastActivity = lastActivities.find(a => a.characterId === c.characterId);

                          const state = (
                            <>
                              <div className='activity'>{lastActivity.lastActivityString}</div>
                              <Moment fromNow>{lastActivity.lastPlayed}</Moment>
                            </>
                          );

                          return (
                            <div key={c.characterId} className='char'>
                              <Button
                                className='linked'
                                anchor
                                to={`/${type}/${id}/${c.characterId}`}
                                action={() => {
                                  store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: type, membershipId: id, characterId: c.characterId } });
                                }}
                              >
                                <div className='icon'>
                                  <i
                                    className={`destiny-class_${utils
                                      .classTypeToString(c.classType)
                                      .toString()
                                      .toLowerCase()}`}
                                  />
                                </div>
                                <div className='text'>
                                  <div>
                                    {utils.raceHashToString(c.raceHash, c.genderType, true)} {utils.classHashToString(c.classHash, c.genderType)}
                                  </div>
                                  <div>
                                    <span>{c.baseCharacterLevel}</span>
                                    <span>
                                      <span>{c.light}</span>
                                    </span>
                                  </div>
                                </div>
                              </Button>
                              {c.titleRecordHash ? <div className='title'>{manifest.DestinyRecordDefinition[c.titleRecordHash].titleInfo.titlesByGenderHash[c.genderHash]}</div> : null}
                              <div className='state'>{state}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className='module'>
                      <div className='sub-header'>
                        <div>{t('Ranks')}</div>
                      </div>
                      <div className='ranks'>
                        {[2772425241, 2626549951, 2000925172].map(hash => {
                          return <Ranks key={hash} mini data={{ membershipType: type, membershipId: id, characterId: lastCharacterPlayed, characters: this.state.all.data.characters.data, characterProgressions: this.state.all.data.characterProgressions.data }} hash={hash} />;
                        })}
                      </div>
                    </div>
                  </>
                ) : this.state.all.error ? (
                  <>
                    <div>
                      <div className='icon'>
                        <ObservedImage className='image' src='/static/images/extracts/ui/010A-00000552.PNG' />
                      </div>
                    </div>
                    <div>
                      <div className='text'>
                        <div className='name'>{t('Private profile')}</div>
                        <div className='description'>{t('This user has their profile privacy set to private')}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
              <div className='sticky-nav mini ultra-black'>
                <div className='sticky-nav-inner'>
                  <div />
                  <ul>
                    <li>
                      <Button action={this.deactivateOverlay}>
                        <DestinyKey type='dismiss' /> {t('Dismiss')}
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (this.state.overlay && this.state.basic.data) {
      return (
        <>
          <div className='member-link' onClick={this.activateOverlay}>
            {!hideFlair && primaryFlair ? (
              <div className={cx('user-flair', primaryFlair.classnames)}>
                <i className={primaryFlair.icon} />
              </div>
            ) : null}
            <div className='emblem'>
              {!this.state.basic.loading && this.state.basic.data ? (
                showClassIcon ? (
                  <div className='icon'>
                    <i
                      className={`destiny-class_${utils
                        .classTypeToString(characterBasic.classType)
                        .toString()
                        .toLowerCase()}`}
                    />
                  </div>
                ) : !hideEmblemIcon ? (
                  <ObservedImage className='image' src={`https://www.bungie.net${characterBasic.emblemPath}`} />
                ) : null
              ) : null}
            </div>
            <div className='displayName'>{displayName ? displayName : !this.state.basic.loading && this.state.basic.data ? this.state.basic.data.profile.data.userInfo.displayName : null}</div>
          </div>
          <div id='member-overlay' className={cx({ error: this.state.all.error })}>
            <div className='wrapper-outer'>
              <div className='background'>
                <div className='border-top' />
                <div className='acrylic' />
              </div>
              <div className={cx('wrapper-inner')}>
                {this.state.all.error ? (
                  <>
                    <div>
                      <div className='icon'>
                        <ObservedImage className='image' src='/static/images/extracts/ui/010A-00000552.PNG' />
                      </div>
                    </div>
                    <div>
                      <div className='text'>
                        <div className='name'>{t('Private profile')}</div>
                        <div className='description'>{t('This user has their profile privacy set to private')}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
              <div className='sticky-nav mini ultra-black'>
                <div className='sticky-nav-inner'>
                  <div />
                  <ul>
                    <li>
                      <Button action={this.deactivateOverlay}>
                        <DestinyKey type='dismiss' /> {t('Dismiss')}
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (this.state.basic.data) {
      return (
        <>
          <div className='member-link' onClick={this.activateOverlay}>
            {!hideFlair && primaryFlair ? (
              <div className={cx('user-flair', primaryFlair.classnames)}>
                <i className={primaryFlair.icon} />
              </div>
            ) : null}
            <div className='emblem'>
              {!this.state.basic.loading && this.state.basic.data ? (
                showClassIcon ? (
                  <div className='icon'>
                    <i
                      className={`destiny-class_${utils
                        .classTypeToString(characterBasic.classType)
                        .toString()
                        .toLowerCase()}`}
                    />
                  </div>
                ) : !hideEmblemIcon ? (
                  <ObservedImage className='image' src={`https://www.bungie.net${characterBasic.emblemPath}`} />
                ) : null
              ) : null}
            </div>
            <div className='displayName'>{displayName ? displayName : !this.state.basic.loading && this.state.basic.data ? this.state.basic.data.profile.data.userInfo.displayName : null}</div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='member-link' onClick={this.activateOverlay}>
            {!hideFlair && primaryFlair ? (
              <div className={cx('user-flair', primaryFlair.classnames)}>
                <i className={primaryFlair.icon} />
              </div>
            ) : null}
            <div className='emblem'>
              {!this.state.basic.loading && this.state.basic.data ? (
                showClassIcon ? (
                  <div className='icon'>
                    <i
                      className={`destiny-class_${utils
                        .classTypeToString(characterBasic.classType)
                        .toString()
                        .toLowerCase()}`}
                    />
                  </div>
                ) : !hideEmblemIcon ? (
                  <ObservedImage className='image' src={`https://www.bungie.net${characterBasic.emblemPath}`} />
                ) : null
              ) : null}
            </div>
            <div className='displayName'>{displayName ? displayName : !this.state.basic.loading && this.state.basic.data ? this.state.basic.data.profile.data.userInfo.displayName : null}</div>
          </div>
        </>
      );
    }
  }
}

export default compose(withTranslation())(MemberLink);
