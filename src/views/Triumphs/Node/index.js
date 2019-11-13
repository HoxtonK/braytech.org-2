import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import dudRecords from '../../../data/dudRecords';
import { enumerateRecordState } from '../../../utils/destinyEnums';
import { ProfileNavLink } from '../../../components/ProfileLink';
import ObservedImage from '../../../components/ObservedImage';
import Records from '../../../components/Records';

class PresentationNode extends React.Component {
  render() {
    const { member, collectibles } = this.props;
    const characterRecords = member.data.profile.characterRecords.data;
    const profileRecords = member.data.profile.profileRecords.data.records;

    const primaryHash = this.props.match.params.primary;
    const definitionPrimary = (manifest.DestinyPresentationNodeDefinition[primaryHash] && manifest.DestinyPresentationNodeDefinition[primaryHash].children.presentationNodes.length && manifest.DestinyPresentationNodeDefinition[primaryHash]) || manifest.DestinyPresentationNodeDefinition[4230728762];

    if (!definitionPrimary) {
      return null;
    }
    
    const secondaryHash = this.props.match.params.secondary || definitionPrimary.children.presentationNodes[0].presentationNodeHash;
    const definitionSecondary = manifest.DestinyPresentationNodeDefinition[secondaryHash];

    const tertiaryHash = this.props.match.params.tertiary || definitionSecondary.children.presentationNodes[0].presentationNodeHash;
    const definitionTertiary = manifest.DestinyPresentationNodeDefinition[tertiaryHash];

    const quaternaryHash = this.props.match.params.quaternary || false;

    const primaryChildren = [];
    definitionPrimary.children.presentationNodes.forEach(child => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      const isActive = (match, location) => {
        if (this.props.match.params.secondary === undefined && definitionPrimary.children.presentationNodes.indexOf(child) === 0) {
          return true;
        } else if (match) {
          return true;
        } else {
          return false;
        }
      };

      primaryChildren.push(
        <li key={definitionNode.hash} className='linked'>
          <ProfileNavLink isActive={isActive} to={`/triumphs/${primaryHash}/${definitionNode.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionNode.displayProperties.icon}`} />
          </ProfileNavLink>
        </li>
      );
    });

    const secondaryChildren = [];
    definitionSecondary.children.presentationNodes.forEach(child => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      if (definitionNode.redacted) {
        return;
      }

      const states = [];

      definitionNode.children.records.forEach(r => {
        const definitionRecord = manifest.DestinyRecordDefinition[r.recordHash];
        const scopeRecord = definitionRecord.scope || 0;
        const dataRecord = scopeRecord === 1 ? characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords[definitionRecord.hash];

        if (collectibles.hideDudRecords && dudRecords.indexOf(r.recordHash) > -1) return;

        states.push(dataRecord);
      });

      const isActive = (match, location) => {
        if (this.props.match.params.tertiary === undefined && definitionSecondary.children.presentationNodes.indexOf(child) === 0) {
          return true;
        } else if (match) {
          return true;
        } else {
          return false;
        }
      };

      const secondaryProgress = states.filter(record => enumerateRecordState(record.state).recordRedeemed).length;
      const secondaryTotal = collectibles && collectibles.hideInvisibleRecords ? states.filter(record => !enumerateRecordState(record.state).invisible).length : states.length;

      if (secondaryTotal === 0) {
        return;
      }

      secondaryChildren.push(
        <li key={definitionNode.hash} className={cx('linked', { completed: secondaryProgress === secondaryTotal && secondaryTotal !== 0, active: definitionTertiary.hash === child.presentationNodeHash })}>
          <div className='text'>
            <div className='name'>{definitionNode.displayProperties.name.length > 24 ? definitionNode.displayProperties.name.slice(0, 24) + '...' : definitionNode.displayProperties.name}</div>
            <div className='progress'>
              <span>{secondaryProgress}</span> / {secondaryTotal}
            </div>
          </div>
          <ProfileNavLink isActive={isActive} to={`/triumphs/${primaryHash}/${secondaryHash}/${definitionNode.hash}`} />
        </li>
      );
    });

    return (
      <div className='node'>
        <div className='header'>
          <div className='name'>
            {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
            {definitionPrimary.displayProperties.name} <span>{definitionPrimary.children.presentationNodes.length !== 1 ? <>// {definitionSecondary.displayProperties.name}</> : null}</span>
          </div>
        </div>
        <div className='children'>
          <ul
            className={cx('list', 'primary', {
              'single-primary': definitionPrimary.children.presentationNodes.length === 1
            })}
          >
            {primaryChildren}
          </ul>
          <ul className='list secondary'>{secondaryChildren}</ul>
        </div>
        <div className='entries'>
          <ul className='list tertiary record-items'>
            <Records hashes={definitionTertiary.children.records.map(child => child.recordHash)} highlight={quaternaryHash} readLink={primaryHash === '564676571'} />
          </ul>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps),
)(PresentationNode);
