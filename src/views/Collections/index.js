import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { ProfileLink } from '../../components/ProfileLink';
import { Button, DestinyKey } from '../../components/UI/Button';

import './styles.css';

import Root from './Root/';
import Node from './Node/';
import BadgeNode from './BadgeNode/';
import AllRankedByRarity from './AllRankedByRarity/';

class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggleCompleted = () => {
    let currentState = this.props.collectibles;
    let newState = {
      hideCompletedCollectibles: !currentState.hideCompletedCollectibles
    };

    this.props.setCollectibleDisplayState(newState);
  };

  componentDidMount() {
    if (!this.props.match.params.quaternary) {
      window.scrollTo(0, 0);
    }

    this.props.rebindTooltips();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.match.params.quaternary && prevProps.location.pathname !== this.props.location.pathname && !(prevProps.match.params.primary === this.props.match.params.primary && this.props.match.params.primary === 'badge')) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { t } = this.props;
    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    let backLinkPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/collections';

    const toggleCompletedLink = (
      <Button action={this.toggleCompleted}>
        {this.props.collectibles.hideCompletedCollectibles ? (
          <>
            <i className='segoe-uniF16E' />
            {t('Show all')}
          </>
        ) : (
          <>
            <i className='segoe-uniF16B' />
            {t('Hide acquired')}
          </>
        )}
      </Button>
    );

    if (!primaryHash) {
      return (
        <div className='view presentation-node root' id='collections'>
          <Root />
        </div>
      );
    } else if (primaryHash === 'badge') {
      return (
        <>
          <div className='view presentation-node' id='collections'>
            <BadgeNode />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>{toggleCompletedLink}</li>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else if (primaryHash === 'all-ranked-by-rarity') {
      return (
        <>
          <div className='view' id='collections'>
            <AllRankedByRarity />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>{toggleCompletedLink}</li>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='view presentation-node' id='collections'>
            <Node primaryHash={primaryHash} />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>{toggleCompletedLink}</li>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCollectibleDisplayState: value => {
      dispatch({ type: 'SET_COLLECTIBLES', payload: value });
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
)(Collections);
