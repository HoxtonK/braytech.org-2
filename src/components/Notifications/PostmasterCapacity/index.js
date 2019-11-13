import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactGA from 'react-ga';

import * as ls from '../../../utils/localStorage';

import './styles.css';

class PostmasterCapacity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ack: false
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  deactivateOverlay = e => {
    e.stopPropagation();

    if (this.mounted) {
      this.setState({ ack: true })

      ReactGA.event({
        category: 'notification',
        action: 'dismiss_PostmasterCapacityWarning'
      });
    }
  };

  componentDidMount() {
    this.mounted = true;
  }

  render() {
    const { t, member } = this.props;

    const auth = ls.get('setting.auth');

    if (auth && auth.destinyMemberships.find(m => m.membershipId === member.membershipId) && member.data.profile.profileInventory) {

      const inventory = member.data.profile.profileInventory.data.items.slice().concat(member.data.profile.characterInventories.data[member.characterId].items);

      const postmaster = inventory.filter(i => i.bucketHash === 215593132);

      if (postmaster.length > 18 && !this.state.ack) {
        return (
          <div id='postmaster-capacity' onClick={this.deactivateOverlay}>
            <div className='wrapper-outer'>
              <div className='background'>
                <div className='border-top' />
                <div className='acrylic' />
              </div>
              <div className='wrapper-inner'>
                <div>
                  <div className='icon'>
                    <span className='destiny-ghost' />
                  </div>
                </div>
                <div>
                  <div className='text'>
                    <div className='name'>{t('WARNING!')}</div>
                    <div className='description'>{postmaster.length === 21 ? t('The Postmaster is completely out of space. If you do not retrieve your items, you will lose them forever!') : t('The Postmaster is almost out of space. If you do not retrieve your items, you will lose them forever!')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    popNotification: value => {
      dispatch({ type: 'POP_NOTIFICATION', payload: value });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(PostmasterCapacity);
