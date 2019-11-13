import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import * as utils from '../../../utils/destinyUtils';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

import './styles.css';

class CharacterEmblem extends React.Component {
  render() {
    const { t, member, onboarding, characterSelect, responsive } = this.props;

    if (member.data && !onboarding && !characterSelect) {
      const { groups } = member.data;
      const { profile, characters } = member.data.profile;

      const characterId = this.props.characterId || member.characterId;

      const character = characters.data.find(c => c.characterId === characterId);

      const progressSeasonalRank = utils.progressionSeasonRank(member);

      return (
        <div className={cx('character-emblem', { responsive })}>
          <div className='wrapper'>
            <ObservedImage
              className={cx('image', 'emblem', {
                missing: !character.emblemBackgroundPath
              })}
              src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
            />
            <div className='displayName'>{profile.data.userInfo.displayName}</div>
            <div className='group'>{groups && groups.results && groups.results.length ? groups.results[0].group.name : ''}</div>
            <div className='light'>{character.light}</div>
            <div className='level'>
              {t('Level')} {character.baseCharacterLevel}
            </div>
            <ProgressBar hideCheck {...progressSeasonalRank} />
          </div>
        </div>
      );
    } else if (onboarding && !characterSelect) {
      return (
        <div className={cx('character-emblem', 'auxiliary', { responsive })}>
          <div className='wrapper'>
            <div className='abs'>
              <div className='text'>{t('Select a character')}</div>
              <div className='icon'><i className='segoe-uniE0AB' /></div>
              <Link to={{ pathname: '/character-select', state: { from: { pathname: '/maps' } } }} />
            </div>
          </div>
        </div>
      );
    } else if (characterSelect) {
      return (
        <div className={cx('character-emblem', 'auxiliary', { responsive })}>
          <div className='wrapper'>
            <div className='abs'>
              <div className='text'>{t('Change profile')}</div>
              <div className='icon'><i className='segoe-uniE0AB' /></div>
              <Link to={{ pathname: '/character-select', state: { from: { pathname: '/maps' } } }} />
            </div>
          </div>
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
)(CharacterEmblem);