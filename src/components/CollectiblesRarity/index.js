import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { orderBy } from 'lodash';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import { ProfileLink } from '../ProfileLink';
import ObservedImage from '../ObservedImage';
import { enumerateCollectibleState } from '../../utils/destinyEnums';

class CollectiblesRarity extends React.Component {
  selfLink = hash => {
    let link = ['/collections'];
    let root = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.collectionRootNode];

    root.children.presentationNodes.forEach(nP => {
      let nodePrimary = manifest.DestinyPresentationNodeDefinition[nP.presentationNodeHash];

      nodePrimary.children.presentationNodes.forEach(nS => {
        let nodeSecondary = manifest.DestinyPresentationNodeDefinition[nS.presentationNodeHash];

        nodeSecondary.children.presentationNodes.forEach(nT => {
          let nodeTertiary = manifest.DestinyPresentationNodeDefinition[nT.presentationNodeHash];

          if (nodeTertiary.children.collectibles.length) {
            let found = nodeTertiary.children.collectibles.find(c => c.collectibleHash === hash);
            if (found) {
              link.push(nodePrimary.hash, nodeSecondary.hash, nodeTertiary.hash, found.collectibleHash);
            }
          } else {
            nodeTertiary.children.presentationNodes.forEach(nQ => {
              let nodeQuaternary = manifest.DestinyPresentationNodeDefinition[nQ.presentationNodeHash];

              if (nodeQuaternary.children.collectibles.length) {
                let found = nodeQuaternary.children.collectibles.find(c => c.collectibleHash === hash);
                if (found) {
                  link.push(nodePrimary.hash, nodeSecondary.hash, nodeTertiary.hash, nodeQuaternary.hash, found.collectibleHash);
                }
              }
            });
          }
        });
      });
    });

    link = link.join('/');
    return link;
  };

  componentDidUpdate(prevProps) {
    if (prevProps.collectibles !== this.props.collectibles) {
      this.props.rebindTooltips();
    }
  }

  render() {
    const { t, forceDisplay, collectibles } = this.props;
    const inspect = this.props.inspect ? true : false;

    let output = [];

    let collectiblesRequested = this.props.hashes.filter(h => h);

    collectiblesRequested.forEach(hash => {
      let collectibleDefinition = manifest.DestinyCollectibleDefinition[hash];

      let link = this.selfLink(hash);

      let state = 0;
      if (this.props.member.data) {
        const characterId = this.props.member.characterId;

        const characterCollectibles = this.props.member.data.profile.characterCollectibles.data;
        const profileCollectibles = this.props.member.data.profile.profileCollectibles.data;

        let scope = profileCollectibles.collectibles[hash] ? profileCollectibles.collectibles[hash] : characterCollectibles[characterId].collectibles[hash];
        if (scope) {
          state = scope.state;
        }

        if (collectibles && collectibles.hideInvisibleCollectibles && enumerateCollectibleState(state).invisible && !forceDisplay) {
          return;
        }

        if (collectibles && collectibles.hideCompletedCollectibles && !enumerateCollectibleState(state).notAcquired && !forceDisplay) {
          return;
        }
      }

      output.push({
        rarity: manifest.statistics.collections && manifest.statistics.collections[collectibleDefinition.hash] ? manifest.statistics.collections[collectibleDefinition.hash] : 100,
        el: (
          <li
            key={collectibleDefinition.hash}
            className={cx('tooltip', {
              linked: link && this.props.selfLinkFrom,
              completed: !enumerateCollectibleState(state).notAcquired
            })}
            data-hash={collectibleDefinition.itemHash}
          >
            <div className='icon'>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{collectibleDefinition.displayProperties.name}</div>
              <div className='commonality'>{manifest.statistics.collections && manifest.statistics.collections[collectibleDefinition.hash] ? manifest.statistics.collections[collectibleDefinition.hash] : `0.00`}%</div>
            </div>
            {link && this.props.selfLinkFrom && !inspect ? <ProfileLink to={{ pathname: link, state: { from: this.props.selfLinkFrom } }} /> : null}
            {inspect && collectibleDefinition.itemHash ? <Link to={{ pathname: `/inspect/${collectibleDefinition.itemHash}`, state: { from: this.props.selfLinkFrom } }} /> : null}
          </li>
        )
      });
    });

    output = orderBy(output, [c => c.rarity], ['desc']);

    if (output.length === 0 && collectibles && collectibles.hideCompletedCollectibles && !forceDisplay) {
      output.push({
        el: (
          <li key='lol' className='all-completed'>
            <div className='properties'>
              <div className='text'>{t('All discovered')}</div>
            </div>
          </li>
        )
      });
    }

    return output.map(e => e.el);
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
)(CollectiblesRarity);
