import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import * as enums from '../../utils/destinyEnums';

class Collectibles extends React.Component {
  render() {
    const { armorClassType } = this.props;

    let output = [];

    let combos = this.props.items;

    if (!combos) {
      return null;
    }

    combos.forEach((c, i) => {
      if (!c.items.length) {
        return null;
      }

      c.items.forEach(hash => {

        let definitionItem = manifest.DestinyInventoryItemDefinition[hash];

        if (!definitionItem) {
          return;
        }

        if (armorClassType > -1 && definitionItem.classType < 3 && definitionItem.classType !== armorClassType) {
          return;
        }

        let itemInstanceId = `${hash}_${c.masterwork || ''}${c.intrinsic || ''}`;
        let itemState = null;

        if (c.masterwork) {
          itemState = 4;
        }

        let definitionCollectible = manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash];

        let state = 0;
        if (this.props.member.data) {
          const characterId = this.props.member.characterId;

          const characterCollectibles = this.props.member.data.profile.characterCollectibles.data;
          const profileCollectibles = this.props.member.data.profile.profileCollectibles.data;

          let scope = profileCollectibles.collectibles[definitionCollectible.hash] ? profileCollectibles.collectibles[definitionCollectible.hash] : characterCollectibles[characterId].collectibles[definitionCollectible.hash];
          if (scope) {
            state = scope.state;
          }
        }

        output.push({
          itemHash: hash,
          itemType: definitionItem.itemType,
          name: definitionItem.displayProperties.name,
          el: (
            <ul className='list' key={`${hash}-${i}`}>
              <li
                className={cx('tooltip', {
                  linked: true,
                  undiscovered: enums.enumerateCollectibleState(state).notAcquired,
                  masterworked: enums.enumerateItemState(itemState).masterworked
                })}
                data-hash={definitionItem.hash}
                data-instanceid={itemInstanceId}
                data-state={itemState}
                onClick={e => {
                  this.props.onClick(e, c);
                }}
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionCollectible.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionItem.displayProperties.name}</div>
                  <div className='commonality'>{manifest.statistics.collections && manifest.statistics.collections[definitionCollectible.hash] ? manifest.statistics.collections[definitionCollectible.hash] : `0.00`}%</div>
                </div>
              </li>
              <li
                className={cx('apply', {
                  linked: true
                })}
                onClick={e => {
                  this.props.onClick(e, c);
                }}
              >
                <i className='segoe-uniE176' />
              </li>
            </ul>
          )
        });
      });
    });

    return orderBy(output, [e => e.itemType, e => e.name], ['desc', 'asc']).map(e => e.el);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
    tooltips: state.tooltips
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushInstance: value => {
      dispatch({ type: 'PUSH_INSTANCE', payload: value });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Collectibles);
