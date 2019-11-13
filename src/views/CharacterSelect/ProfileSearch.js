/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { debounce } from 'lodash';
import { withTranslation } from 'react-i18next';

import * as destinyEnums from '../../utils/destinyEnums';
import * as ls from '../../utils/localStorage';
import * as bungie from '../../utils/bungie';
import Spinner from '../../components/UI/Spinner';

class ProfileSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: false,
      search: '',
      searching: false
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value });
    this.searchForPlayers();
  };

  onSearchKeyPress = e => {
    // If they pressed enter, ignore the debounce and search right meow. MEOW, SON.
    if (e.key === 'Enter') this.searchForPlayers.flush();
  };

  // Debounced so that we don't make an API request for every single
  // keypress - only when they stop typing.
  searchForPlayers = debounce(async () => {
    const displayName = this.state.search;
    if (!displayName) return;

    this.setState({ searching: true });
    try {
      const results = await bungie.SearchDestinyPlayer('-1', displayName);

      if (this.mounted) {
        if (results && results.ErrorCode === 1) this.setState({ results: results.Response, searching: false });
      }
    } catch (e) {
      // If we get an error here it's usually because somebody is being cheeky
      // (eg entering invalid search data), so log it only.
      console.warn(`Error while searching for ${displayName}: ${e}`);
    }
  }, 500);

  profileList(profiles) {
    return profiles.map((p, i) => (
      <li key={i} className='linked' onClick={() => this.props.onProfileClick(p.membershipType, p.membershipId, p.displayName)}>
        <div className='icon'>
          <span className={`destiny-platform_${destinyEnums.PLATFORMS[p.membershipType]}`} />
        </div>
        <div className='displayName'>{p.displayName}</div>
      </li>
    ));
  }

  resultsElement() {
    const { results, searching } = this.state;

    if (searching) {
      return null;
    }

    if (results && results.length > 0) {
      return this.profileList(results);
    } else if (results) {
      return <li className='no-profiles'>{this.props.t('No profiles found')}</li>;
    }

    return null;
  }

  render() {
    const { t } = this.props;
    const { search, searching } = this.state;

    const history = ls.get('history.profiles') || [];

    return (
      <>
        <div className='sub-header'>
          <div>{t('Search for player')}</div>
        </div>
        <div className='form'>
          <div className='field'>
            <input onChange={this.onSearchChange} type='text' placeholder={t('insert gamertag')} spellCheck='false' value={search} onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>

        <div className='results'>{searching ? <Spinner mini /> : <ul className='list'>{this.resultsElement()}</ul>}</div>

        {history.length > 0 && (
          <>
            <div className='sub-header'>
              <div>{t('Previous searches')}</div>
            </div>
            <div className='results'>
              <ul className='list'>{this.profileList(history)}</ul>
            </div>
          </>
        )}
      </>
    );
  }
}

export default withTranslation()(ProfileSearch);
