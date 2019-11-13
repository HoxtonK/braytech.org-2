import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getLanguageInfo } from '../../utils/languageInfo';
import * as ls from '../../utils/localStorage';
import { BungieAuth } from '../../components/BungieAuth';
import Checkbox from '../../components/UI/Checkbox';
import Button from '../../components/UI/Button';

import translationStats from '../../data/translationStats';

import './styles.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    let initLanguage = this.props.i18n.getCurrentLanguage();

    this.state = {
      language: {
        current: initLanguage,
        selected: initLanguage
      },
      swInstalled: false,
      swUpdateAttempt: false,
      swUnregisterAttempt: false
    };
  }

  selectCollectibleDisplayState = state => {
    let currentState = this.props.collectibles;
    let newState = currentState;

    newState = {
      hideCompletedRecords: state === 'hideCompletedRecords' ? !currentState.hideCompletedRecords : currentState.hideCompletedRecords,
      hideCompletedChecklistItems: state === 'hideCompletedChecklistItems' ? !currentState.hideCompletedChecklistItems : currentState.hideCompletedChecklistItems,
      hideInvisibleCollectibles: state === 'hideInvisibleCollectibles' ? !currentState.hideInvisibleCollectibles : currentState.hideInvisibleCollectibles,
      hideInvisibleRecords: state === 'hideInvisibleRecords' ? !currentState.hideInvisibleRecords : currentState.hideInvisibleRecords,
      hideDudRecords: state === 'hideDudRecords' ? !currentState.hideDudRecords : currentState.hideDudRecords,
      hideCompletedCollectibles: state === 'hideCompletedCollectibles' ? !currentState.hideCompletedCollectibles : currentState.hideCompletedCollectibles
    };

    this.props.setCollectibleDisplayState(newState);
  };

  selectLanguage = lang => {
    let temp = this.state.language;
    temp.selected = lang;
    this.setState(temp);
  };

  saveAndRestart = () => {
    console.log(this);
    const { i18n } = this.props;
    i18n.setCurrentLanguage(this.state.language.selected);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  swUpdate = () => {
    if (this.mounted) this.setState({ swUpdateAttempt: true });

    navigator.serviceWorker.getRegistration('/').then(function(registration) {
      registration.update();
    });
  };

  swDump = () => {
    if (this.mounted) this.setState({ swUnregisterAttempt: true });

    navigator.serviceWorker.getRegistration('/').then(function(registration) {
      registration.unregister();
      console.log(registration);
    });
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.mounted = true;

    const swInstalled = await this.swInstalled();

    if (this.mounted && swInstalled) this.setState({ swInstalled: true });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  swAvailable = process.env.NODE_ENV === 'production' && process.env.REACT_APP_BETA === 'true' && 'serviceWorker' in navigator;

  swInstalled = async () => {
    if (this.swAvailable) {
      let registration = await navigator.serviceWorker.getRegistration('/');

      if (registration) return true;
    }

    return false;
  };

  handler_toggleMapsDebugMode = e => {
    if (this.props.maps.debug) {
      this.props.setMaps({ debug: false });
    } else {
      this.props.setMaps({ debug: true });
    }
  };

  handler_toggleMapsDebugModeNoScreenshotHighlight = e => {
    if (this.props.maps.noScreenshotHighlight) {
      this.props.setMaps({ noScreenshotHighlight: false });
    } else {
      this.props.setMaps({ noScreenshotHighlight: true });
    }
  };

  handler_toggleMapsDebugModeLogDetails = e => {
    if (this.props.maps.logDetails) {
      this.props.setMaps({ logDetails: false });
    } else {
      this.props.setMaps({ logDetails: true });
    }
  };

  render() {
    const { t, availableLanguages, location } = this.props;

    let languageButtons = availableLanguages.map(code => {
      let langInfo = getLanguageInfo(code);

      return (
        <li
          key={code}
          onClick={() => {
            this.selectLanguage(code);
          }}
        >
          <Checkbox linked checked={this.state.language.selected === code}>
            <div className='text'>
              <div className='name'>{langInfo.name || langInfo.code}</div>
              <div className='coverage tooltip' data-hash='coverage' data-table='BraytechDefinition'>
                {translationStats[langInfo.code] && Math.floor(((translationStats['internal'].notTranslated - translationStats[langInfo.code].notTranslated) / translationStats['internal'].notTranslated) * 100)}%
              </div>
            </div>
          </Checkbox>
        </li>
      );
    });

    return (
      <div className='view' id='settings'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Settings')}</div>
          </div>
        </div>
        <div className='padder'>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Bungie.net profile')}</div>
            </div>
            <BungieAuth location={location} />
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Theme')}</div>
            </div>
            <ul className='list settings'>
              <li
                key='light'
                onClick={() => {
                  this.props.setTheme('light-mode');
                }}
              >
                <Checkbox linked checked={this.props.theme.selected === 'light-mode'} text={t('Light mode')} />
              </li>
              <li
                key='dark'
                onClick={() => {
                  this.props.setTheme('dark-mode');
                }}
              >
                <Checkbox linked checked={this.props.theme.selected === 'dark-mode'} text={t('Dark mode')} />
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Tooltips')}</div>
            </div>
            <ul className='list settings'>
              <li
                key='simple'
                onClick={() => {
                  this.props.setTooltipDetailMode(false);
                }}
              >
                <Checkbox linked checked={!this.props.tooltips.settings.detailedMode} text={t('Simple')} />
                <div className='info'>
                  <p>{t('Simple tooltips are displayed as per the game, displaying the same stats and socket plugs (perks and mods).')}</p>
                </div>
              </li>
              <li
                key='detailed'
                onClick={() => {
                  this.props.setTooltipDetailMode(true);
                }}
              >
                <Checkbox linked checked={this.props.tooltips.settings.detailedMode} text={t('Detailed')} />
                <div className='info'>
                  <p>{t('Detailed tooltips are an alternate design that display hidden stats and list socket plugs (perks and mods) exhaustively.')}</p>
                </div>
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Local saved data')}</div>
            </div>
            <div className='buttons'>
              <Button
                text={t('Clear profile history')}
                action={() => {
                  ls.set('history.profiles', []);
                }}
              />
              <div className='info'>
                <p>{t('Deletes the stored list of previously loaded member profiles (character select).')}</p>
              </div>
              <Button
                text={t('Clear tracked triumphs')}
                action={() => {
                  this.props.setTrackedTriumphs([]);
                }}
              />
              <div className='info'>
                <p>{t('Clears tracked triumphs permanently.')}</p>
              </div>
              <Button
                text={t('Reset notifications')}
                action={() => {
                  ls.set('history.notifications', []);
                }}
              />
              <div className='info'>
                <p>{t("Reset data pertaining to whether or not you've seen any active notifcation items.")}</p>
              </div>
            </div>
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Visibility')}</div>
            </div>
            <ul className='list settings'>
              <li
                onClick={() => {
                  this.selectCollectibleDisplayState('hideCompletedChecklistItems');
                }}
              >
                <Checkbox linked checked={this.props.collectibles.hideCompletedChecklistItems} text={t('Hide completed checklist items')} />
                <div className='info'>
                  <p>{t('If a checklist item is completed, it will be hidden under Checklist view.')}</p>
                </div>
              </li>
              <li
                onClick={() => {
                  this.selectCollectibleDisplayState('hideCompletedRecords');
                }}
              >
                <Checkbox linked checked={this.props.collectibles.hideCompletedRecords} text={t('Hide completed triumphs')} />
                <div className='info'>
                  <p>{t('If a triumph record is completed and redeemed, it will be hidden under Triumphs views.')}</p>
                </div>
              </li>
              <li
                onClick={() => {
                  this.selectCollectibleDisplayState('hideInvisibleRecords');
                }}
              >
                <Checkbox linked checked={this.props.collectibles.hideInvisibleRecords} text={t('Hide invisible triumph records')} />
                <div className='info'>
                  <p>{t('If the game specifies that you are unable to see a particular triumph record, it will be hidden under Triumphs views.')}</p>
                </div>
              </li>
              <li
                onClick={() => {
                  this.selectCollectibleDisplayState('hideDudRecords');
                }}
              >
                <Checkbox linked checked={this.props.collectibles.hideDudRecords} text={t('Hide dud records')} />
                <div className='info'>
                  <p>{t('Hides dud (empty, unused, or unobtainable) records from view')}</p>
                </div>
              </li>
              <li
                onClick={() => {
                  this.selectCollectibleDisplayState('hideCompletedCollectibles');
                }}
              >
                <Checkbox linked checked={this.props.collectibles.hideCompletedCollectibles} text={t('Hide acquired collection items')} />
                <div className='info'>
                  <p>{t('If a collectible has been acquired, it will be hidden under Collections views.')}</p>
                </div>
              </li>
              <li
                onClick={() => {
                  this.selectCollectibleDisplayState('hideInvisibleCollectibles');
                }}
              >
                <Checkbox linked checked={this.props.collectibles.hideInvisibleCollectibles} text={t('Hide invisible collection items')} />
                <div className='info'>
                  <p>{t('If the game specifies that you are unable to see a particular collectible, it will be hidden under Collections views.')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Language')}</div>
            </div>
            <ul className='list settings'>{languageButtons}</ul>
            <Button text={t('Save and restart')} invisible={this.state.language.current === this.state.language.selected} action={this.saveAndRestart} />
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Developer')}</div>
            </div>
            <ul className='list settings'>
              <li onClick={this.handler_toggleMapsDebugMode}>
                <Checkbox linked checked={this.props.maps.debug} text={t('Maps debug mode')} />
                <div className='info'>
                  <p>{t('Enable Maps debugging settings')}</p>
                </div>
              </li>
              {this.props.maps.debug ? (
                <>
                  <li onClick={this.handler_toggleMapsDebugModeNoScreenshotHighlight}>
                    <Checkbox linked checked={this.props.maps.noScreenshotHighlight} text={t('Highlight nodes without screenshots')} />
                    <div className='info'>
                      <p>{t('Map nodes, such as region chests, which do not have an associated screenshot will be highlighted in order to assist users with contributing to maps data.')}</p>
                    </div>
                  </li>
                  <li onClick={this.handler_toggleMapsDebugModeLogDetails}>
                    <Checkbox linked checked={this.props.maps.logDetails} text={t('Log node details')} />
                    <div className='info'>
                      <p>{t('Console.log details for the mouse-invoked node.')}</p>
                    </div>
                  </li>
                </>
              ) : null}
            </ul>
            <div className='sub-header sub'>
              <div>{t('Troubleshooting')}</div>
            </div>
            <div className='buttons'>
              <Button
                text={t('Reload')}
                action={() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 50);
                }}
              />
              <div className='info'>
                <p>{t('Reload the app')}</p>
              </div>
              {this.swAvailable && this.state.swInstalled ? (
                <>
                  <Button text={t('Update service worker')} disabled={!this.state.swInstalled || this.state.swUpdateAttempt || this.state.swUnregisterAttempt} action={this.swUpdate} />
                  <div className='info'>
                    <p>{t('Attempt to update the service worker immediately. This function will disable the button temporarily. You may continue to use Braytech while it attempts to update in the background. If successful, you will be prompted to restart the app.')}</p>
                  </div>
                  <Button text={t('Dump service worker')} disabled={!this.state.swInstalled || this.state.swUnregisterAttempt} action={this.swDump} />
                  <div className='info'>
                    <p>{t('Attempt to unregister the installed service worker. If successful, reloading the app will allow a new service worker to take its place.')}</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    theme: state.theme,
    tooltips: state.tooltips,
    collectibles: state.collectibles,
    maps: state.maps
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTheme: value => {
      dispatch({ type: 'SET_THEME', payload: value });
    },
    setTooltipDetailMode: value => {
      dispatch({ type: 'SET_TOOLTIPS_DESIGN', payload: { detailedMode: value } });
    },
    setCollectibleDisplayState: value => {
      dispatch({ type: 'SET_COLLECTIBLES', payload: value });
    },
    setTrackedTriumphs: value => {
      dispatch({ type: 'SET_TRACKED_TRIUMPHS', payload: value });
    },
    setMaps: value => {
      dispatch({ type: 'SET_MAPS', payload: value });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Settings);
