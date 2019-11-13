import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import * as utils from '../../../utils/destinyUtils';
import { removeMemberIds } from '../../../utils/paths';
import ProgressBar from '../../UI/ProgressBar';
import Button from '../../../components/UI/Button';

import './styles.css';

class Characters extends React.Component {
  render() {
    const { member, viewport, location } = this.props;
    const characters = member.data.profile.characters;
    const characterActivities = member.data.profile.characterActivities;

    const lastActivities = utils.lastPlayerActivity({ profile: { characters, characterActivities } });

    const publicPaths = ['/maps'];
    const goto = removeMemberIds((location.state && location.state.from && location.state.from.pathname) || '/now');

    return (
      <div className={cx('characters-list', { responsive: viewport.width < 1024 })}>
        {characters.data.map(character => {

          const progressSeasonalRank = utils.progressionSeasonRank(member);

          const lastActivity = lastActivities.find(a => a.characterId === character.characterId);

          const state = (
            <>
              <div className='activity'>{lastActivity.lastActivityString}</div>
              <Moment fromNow>{lastActivity.lastPlayed}</Moment>
            </>
          );

          const to = !publicPaths.includes(goto) ? `/${member.membershipType}/${member.membershipId}/${character.characterId}${goto}` : goto;

          return (
            <div key={character.characterId} className='char'>
              <Button
                className='linked'
                anchor
                to={to}
                action={e => {
                  this.props.characterClick(character.characterId);
                }}
              >
                <ObservedImage
                  className={cx('image', 'emblem', {
                    missing: !character.emblemBackgroundPath
                  })}
                  src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
                />
                <div className='class'>{utils.classHashToString(character.classHash, character.genderType)}</div>
                <div className='species'>{utils.raceHashToString(character.raceHash, character.genderType)}</div>
                <div className='light'>{character.light}</div>
                <ProgressBar hideCheck {...progressSeasonalRank} />
              </Button>
              {character.titleRecordHash ? <div className='title'>{manifest.DestinyRecordDefinition[character.titleRecordHash].titleInfo.titlesByGenderHash[character.genderHash]}</div> : null}
              <div className='state'>{state}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Characters);
