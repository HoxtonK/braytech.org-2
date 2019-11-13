import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import Records from '../Records';
import Collectibles from '../Collectibles';

import './styles.css';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      search: ''
    };

    this.index = [];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.results !== this.state.results) {
      this.props.rebindTooltips();
    }
  }

  componentDidMount() {
    const { scope } = this.props;

    if (scope === 'records') {
      this.index.push(...Object.entries(manifest.DestinyRecordDefinition).filter(([hash, definition]) => !definition.redacted))
    } else if (scope === 'collectibles') {
      this.index.push(...Object.entries(manifest.DestinyCollectibleDefinition).filter(([hash, definition]) => !definition.redacted))
    }
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value });
    this.performSearch();
  };

  onSearchKeyPress = e => {
    // If they pressed enter, ignore the debounce and search
    if (e.key === 'Enter') this.performSearch.flush();
  };

  performSearch = debounce((term = this.state.search) => {
    if (!term || term.length < 2) {
      this.setState({ results: [] });
      return;
    };

    console.log(term);

    term = term.toString().toLowerCase();

    // test for filters
    let filters = term.match(/(type|name|description):/);
    filters = filters && filters.length ? filters[1] : false;

    let results = this.index.filter(([hash, definition])=> {

      const definitionItem = definition.itemHash ? manifest.DestinyInventoryItemDefinition[definition.itemHash] : false;

      let name = definition.displayProperties && definition.displayProperties.name;
      let description = definition.displayProperties && definition.displayProperties.description;
      let type = definitionItem && definitionItem.itemTypeAndTierDisplayName;

      // normalise name, description, and type, removing funny versions of 'e'
      name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      description = description.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      type = type ? definitionItem.itemTypeAndTierDisplayName.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : false;

      let regex = RegExp(term, 'gi');

      if (filters && filters === 'name') {
        regex = RegExp(term.replace('name:', '').trim(), 'gi');
        
        if (regex.test(name)) {
          return true;
        } else {
          return false;
        }
      } else if (filters && filters === 'description') {
        regex = RegExp(term.replace('description:', '').trim(), 'gi');

        if (regex.test(description)) {
          return true;
        } else {
          return false;
        }
      } else if (type && filters && filters === 'type') {
        regex = RegExp(term.replace('type:', '').trim(), 'gi');

        if (regex.test(type)) {
          return true;
        } else {
          return false;
        }
      } else {
        let concatenated = `${name} ${description}`;

        if (regex.test(concatenated)) {
          return true;
        } else {
          return false;
        }
      }


    });

    this.setState({ results });
    
  }, 500);

  render() {
    const { t, scope } = this.props;
    const { results, search } = this.state;

    let display;
    if (scope === 'records') {
      display = (
        <ul className='list record-items'>
          <Records selfLinkFrom='/triumphs' hashes={results.map(r => r[0])} ordered />
        </ul>
      )
    } else if (scope === 'collectibles') {
      display = (
        <ul className='list collection-items'>
          <Collectibles selfLinkFrom='/collections' hashes={results.map(r => r[0])} ordered />
        </ul>
      )
    }

    return (
      <div className={cx('index-search', { 'has-results': results.length })}>
        <div className='form'>
          <div className='field'>
            <input onChange={this.onSearchChange} type='text' placeholder={t('enter name or description')} spellCheck='false' value={search} onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>
        {display}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    tooltips: state.tooltips
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
)(Search);