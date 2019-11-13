import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import Collectibles from '../../../components/Collectibles';
import Search from '../../../components/Search';
import { ProfileLink } from '../../../components/ProfileLink';
import { enumerateCollectibleState } from '../../../utils/destinyEnums';

class Root extends React.Component {
  render() {
    const { t, member } = this.props;

    const characterCollectibles = member.data.profile.characterCollectibles.data;
    const profileCollectibles = member.data.profile.profileCollectibles.data;

    const parent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.collectionRootNode];
    const parentBadges = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.badgesRootNode];

    const nodes = [];
    const badges = [];
    const collectionsStates = [];
    const badgesStates = [];

    // items nodes
    parent.children.presentationNodes.forEach(child => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      const states = [];

      definitionNode.children.presentationNodes.forEach(nodeChild => {
        const definitionNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

        definitionNodeChildNode.children.presentationNodes.forEach(nodeChildNodeChild => {
          const definitionNodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];

          if (definitionNodeChildNodeChildNode.children.presentationNodes.length > 0) {
            definitionNodeChildNodeChildNode.children.presentationNodes.forEach(nodeChildNodeChildNodeChild => {
              const definitionNodeChildNodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChildNodeChild.presentationNodeHash];

              definitionNodeChildNodeChildNodeChildNode.children.collectibles.forEach(collectible => {

                const scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[member.characterId].collectibles[collectible.collectibleHash];

                if (scope) {
                  states.push(scope.state);
                  collectionsStates.push(scope.state);
                }
              });
            });
          } else {
            definitionNodeChildNodeChildNode.children.collectibles.forEach(collectible => {
              const scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[member.characterId].collectibles[collectible.collectibleHash];

              if (scope) {
                states.push(scope.state);
                collectionsStates.push(scope.state);
              }
            });
          }
        });
      });

      const nodeProgress = states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length;
      const nodeTotal = states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length;

      nodes.push(
        <div key={definitionNode.hash} className={cx('node', { completed: nodeTotal > 0 && nodeProgress === nodeTotal })}>
          <div className='images'>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionNode.originalIcon}`} />
          </div>
          <div className='text'>
            <div>{definitionNode.displayProperties.name}</div>
            <div className='state'>
              <span>{nodeProgress}</span> / {nodeTotal}
            </div>
          </div>
          <ProfileLink to={`/collections/${definitionNode.hash}`} />
        </div>
      );
    });

    // badges
    parentBadges.children.presentationNodes.forEach(child => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      const classStates = [];

      let fullComplete = 0;
      let semiComplete = false;

      definitionNode.children.presentationNodes.forEach(nodeChild => {
        const definitionNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

        const sweep = [];
        
        definitionNodeChildNode.children.collectibles.forEach(collectible => {
          const scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[member.characterId].collectibles[collectible.collectibleHash];

          if (scope) {
            sweep.push(scope.state);
          }
        });

        classStates.push({
          className: definitionNodeChildNode.displayProperties.name,
          states: sweep
        });
      });

      const classTotal = classStates.reduce((a, obj) => {
        return Math.max(a, obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length);
      }, 0);

      classStates.forEach(obj => {
        if (obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === classTotal) {
          fullComplete += 1;
          semiComplete = true;
        }
      });

      if (semiComplete) {
        badgesStates.push(definitionNode.displayProperties.name);
      }

      badges.push(
        <li
          key={definitionNode.hash}
          className={cx('badge', 'linked', {
            semiComplete: semiComplete,
            fullComplete: fullComplete === 3
          })}
        >
          <ProfileLink to={`/collections/badge/${definitionNode.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionNode.originalIcon}`} />
            <div className='text'>
              <div>{definitionNode.displayProperties.name}</div>
            </div>
          </ProfileLink>
        </li>
      );
    });

    return (
      <>
        <div className='nodes'>
          <div className='sub-header'>
            <div>{t('Items')}</div>
            <div>
              {collectionsStates.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length}/{collectionsStates.filter(collectible => !enumerateCollectibleState(collectible).invisible).length}
            </div>
          </div>
          <div className='node'>
            <div className='parent'>{nodes}</div>
          </div>
        </div>
        <div className='sidebar'>
          <div className='sub-header'>
            <div>{t('Search')}</div>
          </div>
          <Search scope='collectibles' />
          {profileCollectibles.recentCollectibleHashes ? (
            <>
              <div className='sub-header'>
                <div>{t('Recently discovered')}</div>
              </div>
              <div className='recently-discovered'>
                <ul className='list collection-items'>
                  <Collectibles selfLinkFrom='/collections' forceDisplay hashes={profileCollectibles.recentCollectibleHashes.slice().reverse()} />
                </ul>
              </div>
            </>
          ) : null}
          <div className='sub-header'>
            <div>{t('Badges')}</div>
            <div>
              {badgesStates.length}/{parentBadges.children.presentationNodes.length}
            </div>
          </div>
          <div className='badges'>
            <ul className='list'>{badges}</ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withTranslation()
)(Root);
