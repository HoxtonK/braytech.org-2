import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import moment from 'moment';
import { orderBy } from 'lodash';

import * as utils from '../../utils/destinyUtils';
import * as bungie from '../../utils/bungie';
import * as ls from '../../utils/localStorage';
import { ProfileLink } from '../ProfileLink';
import getGroupMembers from '../../utils/getGroupMembers';
import MemberLink from '../MemberLink';
import Button from '../UI/Button';

import './styles.css';

class Actions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frozen: false,
      primed: false
    };
  }

  memberRank = async (membershipId, promote = false) => {
    const { groupMembers } = this.props;

    let member = groupMembers.members.concat(groupMembers.pending).find(r => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      this.setState(p => ({
        ...p,
        frozen: true
      }));

      let memberType = promote ? member.memberType + 1 : member.memberType - 1;

      const response = await bungie.EditGroupMembership(member.groupId, member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId, memberType);

      if (response && response.ErrorCode === 1) {
        member.memberType = memberType;

        // update parent component through state :s
        this.props.softUpdate();
      }

      this.setState(p => ({
        ...p,
        frozen: false
      }));
    }
  };

  memberKick = async membershipId => {
    const { groupMembers } = this.props;

    let member = groupMembers.members.concat(groupMembers.pending).find(r => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      if (this.state.primed) {
        this.setState(p => ({
          ...p,
          frozen: true
        }));

        const response = await bungie.KickMember(member.groupId, member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId);

        if (response && response.ErrorCode === 1) {
          member.ignore = true;

          // update parent component through state :s
          this.props.softUpdate();
        }
        this.setState(p => ({
          ...p,
          frozen: false,
          primed: false
        }));
      } else {
        this.setState(p => ({
          ...p,
          frozen: false,
          primed: true
        }));
      }
    }
  };

  memberApprove = async membershipId => {
    const { groupMembers } = this.props;
    const group = this.props.member.data.groups.results.length > 0 ? this.props.member.data.groups.results[0].group : false;

    let member = groupMembers.members.concat(groupMembers.pending).find(r => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      this.setState(p => ({
        ...p,
        frozen: true
      }));

      const response = await bungie.ApprovePendingForList(member.groupId, {
        memberships: [
          {
            membershipType: member.destinyUserInfo.membershipType,
            membershipId: member.destinyUserInfo.membershipId,
            displayName: member.destinyUserInfo.displayName
          }
        ],
        message: 'This is a message'
      });
      if (response && response.ErrorCode === 1) {
        member.memberType = group.features.joinLevel;
        member.pending = false;

        this.props.softUpdate();
      }
      this.setState(p => ({
        ...p,
        frozen: false
      }));
    }
  };

  memberDeny = async membershipId => {
    const { groupMembers } = this.props;

    let member = groupMembers.members.concat(groupMembers.pending).find(r => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      this.setState(p => ({
        ...p,
        frozen: true
      }));

      const response = await bungie.DenyPendingForList(member.groupId, {
        memberships: [
          {
            membershipType: member.destinyUserInfo.membershipType,
            membershipId: member.destinyUserInfo.membershipId,
            displayName: member.destinyUserInfo.displayName
          }
        ],
        message: 'This is a message'
      });
      if (response && response.ErrorCode === 1) {
        member.pending = false;
        member.ignore = true;

        this.props.softUpdate();
      }

      this.setState(p => ({
        ...p,
        frozen: false
      }));
    }
  };

  memberBan = async membershipId => {
    const { groupMembers } = this.props;

    let member = groupMembers.members.concat(groupMembers.pending).find(r => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      if (this.state.primed) {
        this.setState(p => ({
          ...p,
          frozen: true
        }));

        const response = await bungie.BanMember(member.groupId, member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId);
        if (response && response.ErrorCode === 1) {
          member.pending = false;
          member.ignore = true;

          this.props.softUpdate();
        }
        this.setState(p => ({
          ...p,
          frozen: false,
          primed: false
        }));
      } else {
        this.setState(p => ({
          ...p,
          frozen: false,
          primed: true
        }));
      }
    }
  };

  render() {
    const { t, m: member, available } = this.props;

    if (member.pending) {
      return (
        <>
          <Button
            text={t('Approve')}
            disabled={this.state.frozen || !available}
            action={() => {
              this.memberApprove(member.destinyUserInfo.membershipId);
            }}
          />
          <Button
            text={t('Deny')}
            disabled={this.state.frozen || !available}
            action={() => {
              this.memberDeny(member.destinyUserInfo.membershipId);
            }}
          />
          <Button
            text={t('Ban')}
            className={cx({ primed: this.state.primed })}
            disabled={this.state.frozen || !available}
            action={() => {
              this.memberBan(member.destinyUserInfo.membershipId);
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <Button
            text={t('Promote')}
            disabled={this.state.frozen || !available || member.memberType > 2}
            action={() => {
              this.memberRank(member.destinyUserInfo.membershipId, true);
            }}
          />
          <Button
            text={t('Demote')}
            disabled={this.state.frozen || !available || member.memberType > 3 || member.memberType === 1}
            action={() => {
              this.memberRank(member.destinyUserInfo.membershipId, false);
            }}
          />
          <Button
            text={t('Kick')}
            className={cx({ primed: this.state.primed })}
            disabled={this.state.frozen || !available || member.memberType === 5}
            action={() => {
              this.memberKick(member.destinyUserInfo.membershipId);
            }}
          />
        </>
      );
    }
  }
}

Actions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Actions);

class RosterAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: {
        sort: false,
        dir: 'desc'
      },
      softUpdate: new Date().getTime()
    };
  }

  auth = ls.get('setting.auth');

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
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;
    let now = new Date();

    // console.log(now - groupMembers.lastUpdated);

    if (group && (now - groupMembers.lastUpdated > 30000 || group.groupId !== groupMembers.groupId)) {
      await getGroupMembers(group, true);

      this.props.rebindTooltips();
    }
  };

  startInterval() {
    this.refreshClanDataInterval = window.setInterval(this.callGetGroupMembers, 60000);
  }

  clearInterval() {
    window.clearInterval(this.refreshClanDataInterval);
  }

  softUpdate = () => {
    this.setState(p => {
      p.softUpdate = new Date().getTime();
      return p;
    });
  };

  changeSortTo = to => {
    this.setState((prevState, props) => {
      prevState.order.dir = prevState.order.sort === to && prevState.order.dir === 'desc' ? 'asc' : 'desc';
      prevState.order.sort = to;
      return prevState;
    });
  };

  render() {
    const { t, member, groupMembers, mini, showOnline = false } = this.props;

    const isAdmin = member.data.groups.results.find(r => {
      const authed = this.auth.destinyMemberships.find(m => m.membershipId === member.membershipId);

      if (r.member.memberType > 2 && authed && r.member.destinyUserInfo.membershipId === authed.membershipId) {
        return true;
      } else {
        return false;
      }
    }) || member.membershipId === '4611686018449662397';

    const results = showOnline ? groupMembers.members.filter(r => r.isOnline) : groupMembers.members.concat(groupMembers.pending);
    let members = [];

    results.forEach(m => {
      if (m.ignore) {
        return;
      }

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

      // if (m.isOnline) {
      //   console.log(lastPlayed);
      // }

      // if (m.destinyUserInfo.membershipId == '4611686018449662397') {
      //   console.log(m)
      // }

      members.push({
        pending: m.pending,
        sorts: {
          private: isPrivate,
          isOnline: m.isOnline,
          joinDate: m.joinDate,
          lastPlayed,
          lastActivity,
          lastCharacter: !isPrivate ? lastCharacter : false,
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
                    <li className='col joinDate'>
                      {!m.pending
                        ? moment(m.joinDate)
                            .locale('relative-sml')
                            .fromNow()
                        : null}
                    </li>
                    <li className='col weeklyXp'>
                      <span>{weeklyXp.toLocaleString('en-us')}</span> / {(characterIds.length * 5000).toLocaleString('en-us')}
                    </li>
                    <li className='col rank'>{m.memberType && utils.groupMemberTypeToString(m.memberType)}</li>
                    <li className='col actions'>
                      <Actions m={m} softUpdate={this.softUpdate} available={isAdmin} />
                    </li>
                  </>
                ) : (
                  <>
                    <li className='col lastCharacter'>–</li>
                    <li className='col lastActivity'>–</li>
                    <li className='col joinDate'>–</li>
                    <li className='col weeklyXp'>–</li>
                    <li className='col rank'>{m.memberType && utils.groupMemberTypeToString(m.memberType)}</li>
                    <li className='col actions'>
                      <Actions m={m} softUpdate={this.softUpdate} available={isAdmin} />
                    </li>
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
    });

    let order = this.state.order;

    if (order.sort === 'lastCharacter') {
      members = orderBy(members, [m => m.sorts.private, m => m.sorts.lastCharacter.light, m => m.sorts.lastPlayed], ['asc', order.dir, order.dir, 'desc']);
    } else if (order.sort === 'joinDate') {
      members = orderBy(members, [m => m.sorts.private, m => m.sorts.joinDate, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'weeklyXp') {
      members = orderBy(members, [m => m.sorts.private, m => m.sorts.weeklyXp, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'rank') {
      members = orderBy(members, [m => m.sorts.private, m => m.sorts.rank, m => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else {
      members = orderBy(members, [m => m.sorts.private, m => m.sorts.isOnline, m => m.sorts.lastActivity, m => m.sorts.lastPlayed, m => m.sorts.lastCharacter.light], ['asc', 'desc', 'desc', 'desc', 'desc']);
    }

    if (!mini) {
      members.unshift({
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
                  className={cx('col', 'joinDate', { sort: this.state.order.sort === 'joinDate', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('joinDate');
                  }}
                >
                  <div className='full'>{t('Joined')}</div>
                  <div className='abbr'>{t('Jind')}</div>
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
                <li
                  className={cx('col', 'rank', { sort: this.state.order.sort === 'rank', asc: this.state.order.dir === 'asc' })}
                  onClick={() => {
                    this.changeSortTo('rank');
                  }}
                >
                  <div className='full'>{t('Rank')}</div>
                  <div className='abbr'>{t('Rank')}</div>
                </li>
                <li className='col actions' />
              </ul>
            </li>
          )
        }
      });
    }

    return (
      <>
        {!mini && members.filter(m => m.pending).length ? <ul className={cx('list', 'roster', 'admin', 'pending')}>{members.filter(m => m.pending).map(m => m.el.full)}</ul> : null}
        <ul className={cx('list', 'roster', 'admin', { mini: mini })}>
          {mini
            ? this.props.limit
              ? members
                  .filter(m => !m.pending)
                  .slice(0, this.props.limit)
                  .map(m => m.el.mini)
              : members.filter(m => !m.pending).map(m => m.el.mini)
            : members.filter(m => !m.pending).map(m => m.el.full)}
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

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushNotification: value => {
      dispatch({ type: 'PUSH_NOTIFICATION', payload: value });
    },
    markStale: member => {
      dispatch({ type: 'MEMBER_IS_STALE', payload: { membershipType: member.membershipType, membershipId: member.membershipId } });
    },
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
)(RosterAdmin);
