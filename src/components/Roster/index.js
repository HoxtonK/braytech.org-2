import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy, groupBy } from 'lodash';
import cx from 'classnames';
import moment from 'moment';

import * as ls from '../../utils/localStorage';
import * as utils from '../../utils/destinyUtils';
import { ProfileLink } from '../../components/ProfileLink';
import getGroupMembers from '../../utils/getGroupMembers';
import MemberLink from '../MemberLink';

import './styles.css';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: {
        sort: false,
        dir: 'desc'
      }
    };
  }

  componentDidMount() {
    const { member } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    if (group) {
      this.callGetGroupMembers(group);
      this.startInterval();
    }
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  callGetGroupMembers = async () => {
    const { member, groupMembers } = this.props;
    const result = member.data.groups.results.length > 0 ? member.data.groups.results[0] : false;

    const auth = ls.get('setting.auth');
    const isAuthed = auth && auth.destinyMemberships && auth.destinyMemberships.find(m => m.membershipId === member.membershipId);

    let now = new Date();

    if (result && (now - groupMembers.lastUpdated > 30000 || result.group.groupId !== groupMembers.groupId)) {
      await getGroupMembers(result.group, result.member.memberType > 2 && isAuthed);

      this.props.rebindTooltips();
    }
  };

  startInterval() {
    this.refreshClanDataInterval = window.setInterval(this.callGetGroupMembers, 60000);
  }

  clearInterval() {
    window.clearInterval(this.refreshClanDataInterval);
  }

  changeSortTo = to => {
    this.setState((prevState, props) => {
      prevState.order.dir = prevState.order.sort === to && prevState.order.dir === 'desc' ? 'asc' : 'desc';
      prevState.order.sort = to;
      return prevState;
    });
  };

  calculateResets = (progressionHash, characterId, characterProgressions) => {
    return {
      current: characterProgressions[characterId].progressions[progressionHash] && Number.isInteger(characterProgressions[characterId].progressions[progressionHash].currentResetCount) ? characterProgressions[characterId].progressions[progressionHash].currentResetCount : '?',
      total:
        characterProgressions[characterId].progressions[progressionHash] && characterProgressions[characterId].progressions[progressionHash].seasonResets
          ? characterProgressions[characterId].progressions[progressionHash].seasonResets.reduce((acc, curr) => {
              if (curr.season > 3) {
                return acc + curr.resets;
              } else {
                return acc;
              }
            }, 0)
          : '?'
    };
  };

  createRow = m => {
    const { member } = this.props;
    
    const isPrivate = !m.profile || (!m.profile.characterActivities.data || !m.profile.characters.data.length);
    const isSelf = !isPrivate ? m.profile.profile.data.userInfo.membershipType.toString() === member.membershipType && m.profile.profile.data.userInfo.membershipId === member.membershipId : false;

    const characterIds = !isPrivate ? m.profile.characters.data.map(c => c.characterId) : [];

    const lastActivities = utils.lastPlayerActivity(m);
    const { characterId: lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode } = orderBy(lastActivities, [a => a.lastPlayed], ['desc'])[0];

    const lastCharacter = !isPrivate ? m.profile.characters.data.find(c => c.characterId === lastCharacterId) : false;

    const weeklyXp = !isPrivate
      ? characterIds.reduce((currentValue, characterId) => {
          let characterProgress = m.profile.characterProgressions.data[characterId].progressions[540048094].weeklyProgress || 0;
          return characterProgress + currentValue;
        }, 0)
      : 0;
    
    const seasonRank = !isPrivate ? utils.progressionSeasonRank({ characterId: m.profile.characters.data[0].characterId, data: m }).level : 0;

    const triumphScore = !isPrivate ? m.profile.profileRecords.data.score : 0;

    let valorPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2626549951].currentProgress : 0;
    let valorResets = !isPrivate ? this.calculateResets(3882308435, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data).total : 0;
    let gloryPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2000925172].currentProgress : 0;
    let infamyPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2772425241].currentProgress : 0;
    let infamyResets = !isPrivate ? this.calculateResets(2772425241, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data).total : 0;

    const totalValor = utils.totalValor();
    const totalInfamy = utils.totalInfamy();

    valorPoints = valorResets * totalValor + valorPoints;
    infamyPoints = infamyResets * totalInfamy + infamyPoints;

    if (m.isOnline) {
      // console.log(m)
      // console.log(lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode);
    }

    return ({
      sorts: {
        private: isPrivate,
        isOnline: m.isOnline,
        fireteamId: m.fireteamId,
        lastPlayed,
        lastCharacter,
        triumphScore,
        gloryPoints,
        valorPoints,
        infamyPoints,
        weeklyXp: (weeklyXp / characterIds.length) * 5000,
        rank: m.memberType
      },
      el: {
        full: (
          <li key={m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId} className={cx('row', { self: isSelf })}>
            <ul>
              <li className='col member'>
                <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} hideEmblemIcon={!m.isOnline} />
              </li>
              {!isPrivate ? (
                <>
                  <li className='col lastCharacter'>
                    <div className='icon'>
                      <i
                        className={`destiny-class_${utils
                          .classTypeToString(lastCharacter.classType)
                          .toString()
                          .toLowerCase()}`}
                      />
                    </div>
                    <div className='icon'>
                      <div>{seasonRank}</div>
                    </div>
                    <div className='icon'>
                      <div className={cx({ 'max-ish': lastCharacter.light >= 930, max: lastCharacter.light >= 960 })}>
                        <span>{lastCharacter.light}</span>
                      </div>
                    </div>
                  </li>
                  <li className={cx('col', 'lastActivity', { display: m.isOnline && lastActivityString })}>
                    {m.isOnline && lastActivityString ? (
                      <div className='tooltip' data-table='DestinyActivityDefinition' data-hash={lastActivity.currentActivityHash} data-mode={lastActivity.currentActivityModeHash} data-playlist={lastActivity.currentPlaylistActivityHash}>
                        <div>
                          {lastActivityString}
                          <span>
                            {moment(lastPlayed)
                              .locale('relative-sml')
                              .fromNow(true)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {moment(lastPlayed)
                          .locale('relative-sml')
                          .fromNow()}
                      </div>
                    )}
                  </li>
                  <li className='col triumphScore'>{triumphScore.toLocaleString('en-us')}</li>
                  <li className='col progression glory'>{gloryPoints.toLocaleString('en-us')}</li>
                  <li className='col progression valor'>
                    {valorPoints.toLocaleString('en-us')} {valorResets ? <div className='resets'>({valorResets})</div> : null}
                  </li>
                  <li className='col progression infamy'>
                    {infamyPoints.toLocaleString('en-us')} {infamyResets ? <div className='resets'>({infamyResets})</div> : null}
                  </li>
                  <li className='col weeklyXp'>
                    <span>{weeklyXp.toLocaleString('en-us')}</span> / {(characterIds.length * 5000).toLocaleString('en-us')}
                  </li>
                </>
              ) : (
                <>
                  <li className='col lastCharacter'>–</li>
                  <li className='col lastActivity'>–</li>
                  <li className='col triumphScore'>–</li>
                  <li className='col glory'>–</li>
                  <li className='col valor'>–</li>
                  <li className='col infamy'>–</li>
                  <li className='col weeklyXp'>–</li>
                </>
              )}
            </ul>
          </li>
        ),
        mini: (
          <li key={m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId} className='row'>
            <ul>
              <li className='col member'>
                <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} hideEmblemIcon={!m.isOnline} />
              </li>
            </ul>
          </li>
        )
      }
    });
  
  }

  render() {
    const { t, groupMembers, mini, showOnline, filter } = this.props;

    let results = [...groupMembers.members];
    
    if (showOnline) {
      results = results.filter(r => r.isOnline);
    }

    if (filter && filter === 'admins') {
      results = results.filter(m => m.memberType > 2);
    }

    const fireteams = [];
    let roster = [];

    results.filter(r => r.profile && r.profile.profileTransitoryData && r.profile.profileTransitoryData.data).forEach((m, i) => {
      const membershipId = m.profile.profile.data.userInfo.membershipId;
      const transitory = m.profile.profileTransitoryData.data;

      const index = fireteams.findIndex(f => f.members.find(m => m.membershipId === membershipId));

      if (index < 0 && transitory.partyMembers.length > 1) {
        fireteams.push({
          id: i,
          currentActivity: transitory.currentActivity,
          members: transitory.partyMembers
        });
      }
    });

    const order = this.state.order;

    if (!order.sort) {

      fireteams.forEach(f => {

        const group = [];

        f.members.forEach(n => {
          const m = results.find(m => m.destinyUserInfo.membershipId === n.membershipId);

          if (!m) return;
          // they're not a clan member

          const isPrivate = !m.profile || (!m.profile.characterActivities.data || !m.profile.characters.data.length);
    
          const fireteam = !isPrivate ? fireteams.find(f => f.members.find(n => n.membershipId === m.profile.profile.data.userInfo.membershipId)) : false;
          m.fireteamId = fireteam && fireteam.id;

          const row = this.createRow(m);
    
          group.push(row);
        });

        roster.push({
          isFireteam: true,
          sorts: {
            private: false,
            isOnline: true,
            fireteamId: f.id + 10,
            lastPlayed: f.currentActivity.startTime
          },
          group
        });

      });

      results.filter(r => !fireteams.find(f => f.members.find(n => n.membershipId === r.destinyUserInfo.membershipId))).forEach(m => {
        
        const fireteam = fireteams.find(f => f.members.find(n => n.membershipId === m.destinyUserInfo.membershipId));
        m.fireteamId = fireteam && fireteam.id;
  
        const row = this.createRow(m);
  
        roster.push(row);
      });

    } else {

      results.forEach(m => {
        const isPrivate = !m.profile || (!m.profile.characterActivities.data || !m.profile.characters.data.length);
    
        const fireteam = !isPrivate ? fireteams.find(f => f.members.find(n => n.membershipId === m.profile.profile.data.userInfo.membershipId)) : false;
        m.fireteamId = fireteam && fireteam.id;
  
        const row = this.createRow(m);
  
        roster.push(row);
      });

    }

    if (order.sort === 'lastCharacter') {
      roster = orderBy(roster, [m => m.sorts.private, m => m.sorts.lastCharacter.light, m => m.sorts.lastPlayed], ['asc', order.dir, order.dir, 'desc']);
    } else if (order.sort === 'triumphScore') {
      roster = orderBy(roster, [m => m.sorts.private, m => m.sorts.triumphScore, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'valor') {
      roster = orderBy(roster, [m => m.sorts.private, m => m.sorts.valorPoints, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'glory') {
      roster = orderBy(roster, [m => m.sorts.private, m => m.sorts.gloryPoints, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'infamy') {
      roster = orderBy(roster, [m => m.sorts.private, m => m.sorts.infamyPoints, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'weeklyXp') {
      roster = orderBy(roster, [m => m.sorts.private, m => m.sorts.weeklyXp, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else {
      roster = orderBy(roster, [m => m.sorts.private, m => m.sorts.isOnline, m => m.sorts.lastPlayed, m => m.sorts.lastCharacter && m.sorts.lastCharacter.light], ['asc', 'desc', 'desc', 'desc']);
    }

    if (!mini) {
      roster.unshift({
        sorts: {},
        el: {
          full: (
            <li key='header-row' className='row header'>
              <ul>
                <li className='col member' />
                <li
                  className={cx('col', 'lastCharacter', { sort: this.state.order.sort === 'lastCharacter', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('lastCharacter');
                  }}
                >
                  <div className='full'>{t('Last character')}</div>
                  <div className='abbr'>{t('Char')}</div>
                </li>
                <li
                  className={cx('col', 'lastActivity', { sort: !this.state.order.sort })}
                  onClick={() => {
                    this.changeSortTo(false);
                  }}
                >
                  <div className='full'>{t('Last activity')}</div>
                  <div className='abbr'>{t('Activity')}</div>
                </li>
                <li
                  className={cx('col', 'triumphScore', { sort: this.state.order.sort === 'triumphScore', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('triumphScore');
                  }}
                >
                  <div className='full'>{t('Triumph score')}</div>
                  <div className='abbr'>{t('T. Scr')}</div>
                </li>
                <li
                  className={cx('col', 'glory', { sort: this.state.order.sort === 'glory', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('glory');
                  }}
                >
                  <div className='full'>{t('Glory')}</div>
                  <div className='abbr'>{t('Gly')}</div>
                </li>
                <li
                  className={cx('col', 'valor', { sort: this.state.order.sort === 'valor', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('valor');
                  }}
                >
                  <div className='full'>{t('Valor (Resets)')}</div>
                  <div className='abbr'>{t('Vlr (R)')}</div>
                </li>
                <li
                  className={cx('col', 'infamy', { sort: this.state.order.sort === 'infamy', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('infamy');
                  }}
                >
                  <div className='full'>{t('Infamy (Resets)')}</div>
                  <div className='abbr'>{t('Inf (R)')}</div>
                </li>
                <li
                  className={cx('col', 'weeklyXp', { sort: this.state.order.sort === 'weeklyXp', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('weeklyXp');
                  }}
                >
                  <div className='full'>{t('Weekly Clan XP')}</div>
                  <div className='abbr'>{t('Clan XP')}</div>
                </li>
              </ul>
            </li>
          )
        }
      });
    }

    if (mini && groupMembers.members.filter(member => member.isOnline).length < 1) {
      return (
        <div className='roster'>
          <div className='info'>{t("There's no one here right now.")}</div>
          <ProfileLink className='button' to='/clan/roster'>
            <div className='text'>{t('See full roster')}</div>
          </ProfileLink>
        </div>
      );
    } else {
      return (
        <>
          <ul className={cx('list', 'roster', { mini: mini })}>
            {mini ? (
              this.props.limit ?
                roster.slice(0, this.props.limit).map(r => {
                  if (r.isFireteam) {
                    return (
                      <li key={r.sorts.fireteamId} className='fireteam'>
                        <ul>
                          {r.group.map(m => m.el.mini)}
                        </ul>
                      </li>
                    )
                  } else {
                    return r.el.mini;
                  }
                }) :
                roster.map(r => {
                  if (r.isFireteam) {
                    return (
                      <li key={r.sorts.fireteamId} className='fireteam'>
                        <ul>
                          {r.group.map(m => m.el.mini)}
                        </ul>
                      </li>
                    )
                  } else {
                    return r.el.mini;
                  }
                })) :
                roster.map(r => {
                  if (r.isFireteam) {
                    return (
                      <li key={r.sorts.fireteamId} className='fireteam'>
                        <ul>
                          {r.group.map(m => m.el.full)}
                        </ul>
                      </li>
                    )
                  } else {
                    return r.el.full;
                  }
                })
            }
          </ul>
          {mini ? (
            <ProfileLink className='button' to='/clan/roster'>
              <div className='text'>{t('See full roster')}</div>
            </ProfileLink>
          ) : null}
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers
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
)(Roster);
