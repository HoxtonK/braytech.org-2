import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { transform, isEqual, isObject } from 'lodash';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import { ProfileLink } from '../../ProfileLink';
import { enumerateRecordState } from '../../../utils/destinyEnums';
import { selfLink } from '../../Records';

import './styles.css';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */

function difference(object, base) {
  function changes(object, base) {
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

class NotificationProgress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: {
        type: false,
        hash: false,
        number: 0,
        timedOut: true
      }
    };
    this.timer = false;
  }

  timeOut = () => {
    if (!this.timer && !this.state.progress.timedOut && this.state.progress.hash) {
      this.timer = setTimeout((prevState = this.state) => {
        this.timer = false;
        console.log('timed out');
        this.setState(p => ({
          progress: {
            ...p.progress,
            timedOut: true
          }
        }));
      }, 10000);
    }
  };

  componentDidUpdate(prevProps) {
    this.timeOut();

    const member = this.props.member;
    const fresh = this.props.member.data;
    const stale = this.props.member.prevData || false;

    if (prevProps.member.membershipId !== this.props.member.membershipId) {
      // console.log('membershipId mismatch');
      return;
    }

    if (!stale) {
      // console.log('not stale yet');
      return;
    }

    // console.log('characters', difference(fresh.profile.characters, stale.profile.characters));
    // console.log('profileRecords', difference(fresh.profile.profileRecords.data.records, stale.profile.profileRecords.data.records));
    // console.log('characterRecords', difference(fresh.profile.characterRecords.data[characterId].records, stale.profile.characterRecords.data[characterId].records));
    // console.log('profileProgression', difference(fresh.profile.profileProgression, stale.profile.profileProgression));
    // console.log('characterProgressions', difference(fresh.profile.characterProgressions.data[characterId], stale.profile.characterProgressions.data[characterId]));
    // console.log('profileCollectibles', difference(fresh.profile.profileCollectibles.data.collectibles, stale.profile.profileCollectibles.data.collectibles));
    // console.log('characterCollectibles', difference(fresh.profile.characterCollectibles.data[characterId].collectibles, stale.profile.characterCollectibles.data[characterId].collectibles));

    if (!this.state.progress.timedOut) {
      // console.log('not timed out yet');
      return;
    }

    let profileRecords = difference(fresh.profile.profileRecords.data.records, stale.profile.profileRecords.data.records);
    let characterRecords = difference(fresh.profile.characterRecords.data[member.characterId].records, stale.profile.characterRecords.data[member.characterId].records);

    // console.log(profileRecords);

    let progress = {
      type: false,
      hash: false,
      number: 0,
      timedOut: false
    };

    if (Object.keys(profileRecords).length > 0) {
      Object.keys(profileRecords).forEach(key => {
        if (profileRecords[key].state === undefined) {
          return;
        }
        let state = enumerateRecordState(profileRecords[key].state);
        // console.log(state);
        if (!state.objectiveNotCompleted && !state.recordRedeemed) {
          if (progress.hash) {
            progress.number = progress.number + 1;
            return;
          }
          progress.type = 'record';
          progress.hash = key;
          progress.number = progress.number + 1;
        }
      });
    }

    if (Object.keys(characterRecords).length > 0) {
      Object.keys(characterRecords).forEach(key => {
        if (characterRecords[key].state === undefined) {
          return;
        }
        let state = enumerateRecordState(characterRecords[key].state);
        // console.log(state);
        if (!state.objectiveNotCompleted && !state.recordRedeemed) {
          if (progress.hash) {
            progress.number = progress.number + 1;
            return;
          }
          progress.type = 'record';
          progress.hash = key;
          progress.number = progress.number + 1;
        }
      });
    }

    if (this.state.progress.timedOut && progress.type && this.state.progress.hash !== progress.hash) {
      this.setState({
        progress
      });
    }
  }

  render() {
    if (this.state.progress.type === 'record') {
      let definitionRecord = manifest.DestinyRecordDefinition[this.state.progress.hash];

      let link = selfLink(definitionRecord.hash);

      let description = definitionRecord.displayProperties.description !== '' ? definitionRecord.displayProperties.description : false;
      description = !description && definitionRecord.loreHash ? manifest.DestinyLoreDefinition[definitionRecord.loreHash].displayProperties.description.slice(0, 117).trim() + '...' : description;

      return (
        <div id='notification-progress' className={cx('record', { lore: definitionRecord.loreHash, timedOut: this.state.progress.timedOut })}>
          <div className='type'>
            <div className='text'>Triumph completed</div>
          </div>
          <div className='item'>
            <div className='properties'>
              <div className='name'>{definitionRecord.displayProperties.name}</div>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionRecord.displayProperties.icon}`} noConstraints />
              <div className='description'>{description}</div>
            </div>
            {this.state.progress.number > 1 ? <div className='more'>And {this.state.progress.number - 1} more</div> : null}
          </div>
          {link ? <ProfileLink to={link} /> : null}
        </div>
      );
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

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(NotificationProgress);
