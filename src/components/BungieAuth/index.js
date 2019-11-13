import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { Redirect, Link, withRouter } from 'react-router-dom';
import cx from 'classnames';
import Moment from 'react-moment';
import queryString from 'query-string';

import store from '../../utils/reduxStore';
import * as ls from '../../utils/localStorage';
import * as bungie from '../../utils/bungie';
import * as destinyEnums from '../../utils/destinyEnums';
import * as paths from '../../utils/paths';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import ObservedImage from '../ObservedImage';

import './styles.css';

class BungieAuth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false,
      error: false
    };
  }

  getAccessTokens = async code => {
    await bungie.GetOAuthAccessToken(`client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&grant_type=authorization_code&code=${code}`);

    if (this.mounted) {
      this.getMemberships();
    }
  };

  getMemberships = async () => {
    const response = await bungie.GetMembershipDataForCurrentUser();

    if (this.mounted) {
      if (response && response.ErrorCode === 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          memberships: response.Response
        }));
      } else if (response && response.ErrorCode !== 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          error: response
        }));
      } else {
        this.setState(p => ({
          ...p,
          loading: false,
          error: true
        }));
      }
    }
  };

  componentDidMount() {
    this.mounted = true;

    const { location } = this.props;
    const tokens = ls.get('setting.auth');

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (!tokens && code) {
      this.getAccessTokens(code);
    } else if (tokens) {
      this.getMemberships();
    } else if (this.mounted) {
      this.setState(p => ({
        ...p,
        loading: false
      }));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, location } = this.props;
    const { loading, memberships, error } = this.state;

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (code) {
      return <Redirect to='/settings' />;
    }

    if (loading) {
      return <Spinner mini />;
    } else {
      if (memberships && !error) {
        return (
          <div className='bungie-auth'>
            <div className='member'>
              <ObservedImage className='image background' src={`https://www.bungie.net/img/UserThemes/${memberships.bungieNetUser.profileThemeName}/header.jpg`} />
              <div className='details'>
                <div className={cx('icon', { shadow: !/.gif/.test(memberships.bungieNetUser.profilePicturePath) })}>
                  <ObservedImage className='image' src={`https://www.bungie.net${memberships.bungieNetUser.profilePicturePath}`} />
                </div>
                <div className='text'>
                  <div className='displayName'>{memberships.bungieNetUser.displayName}</div>
                  <div className='firstAccess'>
                    <Moment format='DD/MM/YYYY'>{memberships.bungieNetUser.firstAccess}</Moment>
                  </div>
                </div>
              </div>
            </div>
            <div className='memberships'>
              <h4>{t('Associated memberships')}</h4>
              <ul className='list'>
                {memberships.destinyMemberships.map(m => {
                  return (
                    <li key={m.membershipId} className='linked'>
                      <div className='icon'>
                        <span className={`destiny-platform_${destinyEnums.PLATFORMS[m.membershipType]}`} />
                      </div>
                      <div className='displayName'>{memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                      {m.crossSaveOverride === m.membershipType ? <div className='crosssave' /> : null}
                      <Link
                        to='/character-select'
                        onClick={e => {
                          store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: m.membershipType, membershipId: m.membershipId } });
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
              <div className='info'>
                <p>{t('These are the memberships that are currenty associated with your Bungie.net profile.')}</p>
              </div>
            </div>
            <h4>{t('Authentication data')}</h4>
            <Button
              text={t('Forget me')}
              action={() => {
                ls.del('setting.auth');
                this.setState((prevState, props) => {
                  prevState.memberships = false;
                  return prevState;
                });
              }}
            />
            <div className='info'>
              <p>{t('Delete the authentication data stored on your device. While unnecessary, this function is provided for your peace of mind.')}</p>
            </div>
          </div>
        );
      } else {
        if (error) {
          return (
            <div className='bungie-auth'>
              <div className='text'>
                {error.ErrorCode ? (
                  <>
                    <p>
                      {error.ErrorCode} {error.ErrorStatus}
                    </p>
                    <p>{error.Message}</p>
                  </>
                ) : (
                  t('Unknown error')
                )}
              </div>
              <Button
                text={t('Authenticate')}
                action={() => {
                  window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
                }}
              />
            </div>
          );
        } else {
          return (
            <div className='bungie-auth'>
              <Button
                text={t('Authenticate')}
                action={() => {
                  window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
                }}
              />
            </div>
          );
        }
      }
    }
  }
}

class BungieAuthMini extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false,
      error: false
    };
  }

  getAccessTokens = async code => {
    await bungie.GetOAuthAccessToken(`client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&grant_type=authorization_code&code=${code}`);

    if (this.mounted) {
      this.getMemberships();
    }
  };

  getMemberships = async () => {
    const response = await bungie.GetMembershipDataForCurrentUser();

    if (this.mounted) {
      if (response && response.ErrorCode === 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          memberships: response.Response
        }));
      } else if (response && response.ErrorCode !== 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          error: response
        }));
      } else {
        this.setState(p => ({
          ...p,
          loading: false,
          error: true
        }));
      }
    }
  };

  componentDidMount() {
    this.mounted = true;

    const { location } = this.props;
    const tokens = ls.get('setting.auth');

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (!tokens && code) {
      this.getAccessTokens(code);
    } else if (tokens) {
      this.getMemberships();
    } else if (this.mounted) {
      this.setState(p => ({
        ...p,
        loading: false
      }));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, location } = this.props;
    const { loading, memberships, error } = this.state;

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (code) {
      return <Redirect to='/settings' />;
    }

    if (loading) {
      return <Spinner mini />;
    } else {
      if (memberships && !error) {
        return (
          <div className='bungie-auth'>
            <div className='memberships'>
              <ul className='list'>
                {memberships.destinyMemberships.map(m => {
                  return (
                    <li key={m.membershipId} className='linked'>
                      <div className='icon'>
                        <span className={`destiny-platform_${destinyEnums.PLATFORMS[m.membershipType]}`} />
                      </div>
                      <div className='displayName'>{memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                      {m.crossSaveOverride === m.membershipType ? <div className='crosssave' /> : null}
                      <Link
                        to='/character-select'
                        onClick={e => {
                          store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: m.membershipType, membershipId: m.membershipId } });
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      } else {
        if (error) {
          return (
            <div className='bungie-auth'>
              <div className='text'>
                {error.ErrorCode ? (
                  <>
                    <p>
                      {error.ErrorCode} {error.ErrorStatus}
                    </p>
                    <p>{error.Message}</p>
                  </>
                ) : (
                  t('Unknown error')
                )}
              </div>
              <Button
                text={t('Authenticate')}
                action={() => {
                  window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
                }}
              />
            </div>
          );
        } else {
          return (
            <div className='bungie-auth'>
              <Button
                text={t('Authenticate')}
                action={() => {
                  window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
                }}
              />
            </div>
          );
        }
      }
    }
  }
}

class BungieAuthButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t } = this.props;

    return (
      <div className='bungie-auth'>
        <Button
          text={t('Login with Bungie.net')}
          action={() => {
            window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
          }}
        />
      </div>
    );
  }
}

class NoAuth extends React.Component {
  render() {
    const { t, inline } = this.props;

    return (
      <div className={cx('bungie-auth', 'no-auth', { inline })}>
        <div className='module'>
          <div className='properties'>
            <div className='name'>{t('Authentication required')}</div>
            <div className='description'>
              <p>{t('Some features of Braytech require your written permission to activate, generally to protect your privacy.')}</p>
              <p>{t('To use this feature, please tell Bungie that you approve. No personal information is shared by doing so—only an authentication code with which you may interact with more API endpoints.')}</p>
            </div>
            <Button
              text={t('Authenticate')}
              action={() => {
                window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

class DiffProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false,
      error: false
    };
  }

  getMemberships = async () => {
    const response = await bungie.GetMembershipDataForCurrentUser();

    if (this.mounted) {
      if (response && response.ErrorCode === 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          memberships: response.Response
        }));
      } else if (response && response.ErrorCode !== 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          error: response
        }));
      } else {
        this.setState(p => ({
          ...p,
          loading: false,
          error: true
        }));
      }
    }
  };

  componentDidMount() {
    this.mounted = true;

    const tokens = ls.get('setting.auth');

    if (tokens) {
      console.log(tokens);

      this.getMemberships();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, inline, location } = this.props;
    const { loading, memberships, error } = this.state;
    const pathname = paths.removeMemberIds(location.pathname);

    let properties;
    if (pathname === '/clan/admin') {
      properties = (
        <>
          <div className='name'>{t("OI, ge'outofit")}</div>
          <div className='description'>
            <p>{t("This doesn't appear to be your clan and so you may not will any actions upon it. You may use these helpful links to jump to your own or you may find more information regarding your current authorization in the Settings view.")}</p>
          </div>
        </>
      );
    } else {
      properties = (
        <>
          <div className='name'>{t('Oh, honey')}</div>
          <div className='description'>
            <p>{t("You are not authorised to access a different user's profile data, but you may use these helpful links to return to your own.")}</p>
            <p>{t('You can find more information regarding your authentication in the Settings view.')}</p>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <div className='bungie-auth'>
          <div className='text'>
            {error.ErrorCode ? (
              <>
                <p>
                  {error.ErrorCode} {error.ErrorStatus}
                </p>
                <p>{error.Message}</p>
              </>
            ) : (
              t('Unknown error')
            )}
          </div>
          <Button
            text={t('Authenticate')}
            action={() => {
              window.location = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;
            }}
          />
        </div>
      );
    } else {
      return (
        <div className={cx('bungie-auth', 'no-auth', { inline })}>
          <div className='module'>
            <div className='properties'>
              {properties}
              {loading ? (
                <Spinner mini />
              ) : (
                <div className='memberships'>
                  <ul className='list'>
                    {memberships.destinyMemberships.map(m => {
                      return (
                        <li key={m.membershipId} className='linked'>
                          <div className='icon'>
                            <span className={`destiny-platform_${destinyEnums.PLATFORMS[m.membershipType]}`} />
                          </div>
                          <div className='displayName'>{memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                          {m.crossSaveOverride === m.membershipType ? <div className='crosssave' /> : null}
                          <Link
                            to='/character-select'
                            onClick={e => {
                              store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: m.membershipType, membershipId: m.membershipId } });
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

BungieAuth = compose(withTranslation())(BungieAuth);

BungieAuthMini = compose(withTranslation())(BungieAuthMini);

BungieAuthButton = compose(withTranslation())(BungieAuthButton);

NoAuth = compose(withTranslation())(NoAuth);

DiffProfile = compose(
  withTranslation(),
  withRouter
)(DiffProfile);

export { BungieAuth, BungieAuthMini, BungieAuthButton, NoAuth, DiffProfile };
