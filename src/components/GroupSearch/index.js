import React from 'react';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash/debounce';
import { withTranslation } from 'react-i18next';

import * as bungie from '../../utils/bungie';
import * as voluspa from '../../utils/voluspa';
import * as responseUtils from '../../utils/responseUtils';
import Spinner from '../../components/UI/Spinner';
import Button from '../../components/UI/Button';
import ClanBanner from '../../components/UI/ClanBanner';

import './styles.css';

class GroupSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: false,
      search: '',
      searching: true
    };
    this.mounted = false;
  }

  componentWillUnmount() {
    // If we don't do this, the searchForPlayers may attempt to setState on
    // an unmounted component. We can't cancel it as it's using
    // fetch, which doesn't support cancels :(
    this.mounted = false;
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value });
    this.searchForGroups();
  };

  onSearchKeyPress = e => {
    // If they pressed enter, ignore the debounce and search
    if (e.key === 'Enter') this.searchForGroups.flush();
  };

  // Debounced so that we don't make an API request for every single
  // keypress - only when they stop typing.
  searchForGroups = debounce(async (groupName = this.state.search) => {
    if (!groupName) return;

    this.setState({ searching: true });
    try {
      let result = await bungie.GetGroupByName(groupName);
      if (this.mounted) {
        result = responseUtils.groupScrubber(result);
        this.setState({ result: result, searching: false });
        voluspa.store({ groupId: result.detail.groupId });
      }
    } catch (e) {
      // If we get an error here it's usually because somebody is being cheeky
      // (eg entering invalid search data), so log it only.
      if (this.mounted) this.setState({ result: false, searching: false });
      console.warn(`Error while searching for ${groupName}: ${e}`);
    }
  }, 500);

  componentDidMount() {
    this.mounted = true;
    
    if (this.props.initial) {
      this.searchForGroups(this.props.initial);
    }
  }

  resultsElement = () => {
    const { t } = this.props;
    const { result, searching } = this.state;

    if (searching) {
      return null;
    }

    if (result) {
      
      // console.log(result);

      return (
        <div className='clan'>
          <div className='banner'>
            <ClanBanner bannerData={result.detail.clanInfo.clanBannerData} />
          </div>
          <div className='details'>
            <div>
            <div className='name'>
              {result.detail.name}
                <div className='tag'>[{result.detail.clanInfo.clanCallsign}]</div>
              </div>
              {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
              <div className='memberCount'>
                // {result.detail.memberCount} {t('members')}
              </div>
              <div className='motto'>{result.detail.motto}</div>
              <ReactMarkdown className='bio' escapeHtml disallowedTypes={['image', 'imageReference']} source={result.detail.about} />
            </div>
            <div>
              <Button text='View clan leaderboard' disabled={false} anchor to={`/leaderboards/group/${result.detail.groupId}`} />
            </div>
          </div>
        </div>
      );
    } else {
      return <div className='text'>{this.props.t('No clans found')}</div>;
    }
  }

  render() {
    const { t } = this.props;
    const { search, searching } = this.state;

    return (
      <div className='group-search'>
        <div className='form'>
          <div className='field'>
            <input onChange={this.onSearchChange} type='text' placeholder={t('insert precise clan name')} spellCheck='false' value={search} onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>

        <div className='result'>{searching ? <Spinner mini /> : this.resultsElement()}</div>
      </div>
    );
  }
}

export default withTranslation()(GroupSearch);
