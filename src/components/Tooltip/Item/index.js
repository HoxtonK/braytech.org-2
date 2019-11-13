import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { sockets } from '../../../utils/destinyItems/sockets';
import { stats } from '../../../utils/destinyItems/stats';
import { masterwork } from '../../../utils/destinyItems/masterwork';
import ObservedImage from '../../ObservedImage';

import Default from './Default';
import Equipment from './Equipment';
import Emblem from './Emblem';
import Mod from './Mod';

const woolworths = {
  equipment: Equipment,
  emblem: Emblem,
  mod: Mod
}

class Item extends React.Component {
  render() {
    const { t, member, tooltips } = this.props;

    const item = {
      itemHash: this.props.hash,
      instanceId: this.props.instanceid || false,
      itemComponents: false,
      quantity: parseInt(this.props.quantity, 10) || 1,
      state: (this.props.state && parseInt(this.props.state, 10)) || 0,
      rarity: false,
      type: false
    };

    const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

    if (item.itemHash !== '343' && !definitionItem) {
      return null;
    }
  
    if (item.itemHash === '343' || definitionItem.redacted) {
      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', 'common')}>
            <div className='header'>
              <div className='name'>Classified</div>
              <div>
                <div className='kind'>Insufficient clearance</div>
              </div>
            </div>
            <div className='black'>
              <div className='description'>
                <pre>Keep it clean.</pre>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (definitionItem && definitionItem.inventory) {
      switch (definitionItem.inventory.tierType) {
        case 6:
          item.rarity = 'exotic';
          break;
        case 5:
          item.rarity = 'legendary';
          break;
        case 4:
          item.rarity = 'rare';
          break;
        case 3:
          item.rarity = 'uncommon';
          break;
        case 2:
          item.rarity = 'common';
          break;
        default:
          item.rarity = 'common';
      }

      if (definitionItem.itemType === 2) {
        item.type = 'equipment';
      } else if (definitionItem.itemType === 3) {
        item.type = 'equipment';
      } else if (definitionItem.itemType === 21) {
        item.type = 'equipment';
      } else if (definitionItem.itemType === 22) {
        item.type = 'equipment';
      } else if (definitionItem.itemType === 24) {
        item.type = 'equipment';
      } else if (definitionItem.itemType === 28) {
        item.type = 'equipment';
      } else if (definitionItem.itemType === 14) {
        item.type = 'emblem';
      } else if (definitionItem.itemType === 19) {
        item.type = 'mod';
      }
    }

    if (item.instanceId && member.data && member.data.profile.itemComponents.instances.data[item.instanceId]) {
      let itemComponents = member.data.profile.itemComponents;

      item.itemComponents = {
        instance: itemComponents.instances.data[item.instanceId] ? itemComponents.instances.data[item.instanceId] : false,
        sockets: itemComponents.sockets.data[item.instanceId] ? itemComponents.sockets.data[item.instanceId].sockets : false,
        perks: itemComponents.perks.data[item.instanceId] ? itemComponents.perks.data[item.instanceId].perks : false,
        stats: itemComponents.stats.data[item.instanceId] ? itemComponents.stats.data[item.instanceId].stats : false,
        objectives: itemComponents.objectives.data[item.instanceId] ? itemComponents.objectives.data[item.instanceId].objectives : false
      };
    } else if (item.instanceId && tooltips.itemComponents[item.instanceId]) {
      item.itemComponents = tooltips.itemComponents[item.instanceId];
    } else {
      item.itemComponents = false;
    }

    if (member.data.profile && member.data.profile.characterUninstancedItemComponents && member.data.profile.characterUninstancedItemComponents[member.characterId].objectives && member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[item.itemHash]) {
      if (item.itemComponents) {
        item.itemComponents.objectives = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[item.itemHash].objectives;
      } else {
        item.itemComponents = {
          objectives: member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[item.itemHash].objectives
        };
      }
    }

    if (item.instanceId && member.data.profile && member.data.profile.characterInventories && member.data.profile.characterInventories.data && member.data.profile.characterInventories.data[member.characterId] && member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === item.instanceId)) {
      if (item.itemComponents) {
        item.itemComponents.item = member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === item.instanceId);
      } else {
        item.itemComponents = {
          item: member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === item.instanceId)
        };
      }
    }

    item.masterwork = enums.enumerateItemState(item.state).masterwork;
    item.sockets = sockets(item);
    item.stats = stats(item);
    item.masterworkInfo = masterwork(item);

    item.primaryStat = (definitionItem.itemType === 2 || definitionItem.itemType === 3) && definitionItem.stats && !definitionItem.stats.disablePrimaryStatDisplay && definitionItem.stats.primaryBaseStatHash && {
      hash: definitionItem.stats.primaryBaseStatHash,
      displayProperties: manifest.DestinyStatDefinition[definitionItem.stats.primaryBaseStatHash].displayProperties,
      value: 750
    };

    if (item.primaryStat && item.itemComponents && item.itemComponents.instance && item.itemComponents.instance.primaryStat) {
      item.primaryStat.value = item.itemComponents.instance.primaryStat.value;
    } else if (item.primaryStat && member && member.data) {
      let character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);

      item.primaryStat.value = Math.floor((733 / 750) * character.light);
    }

    let note = false;
    if (!item.itemComponents && this.props.uninstanced) {
      note = t('Collections roll');
    }

    const Meat = item.type && woolworths[item.type];

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', item.type, item.rarity, { 'masterworked': item.masterwork || (item.masterworkInfo && item.masterworkInfo.tier === 10) })}>
          <div className='header'>
            {item.masterwork || (item.masterworkInfo && item.masterworkInfo.tier === 10) ? <ObservedImage className={cx('image', 'bg')} src={item.rarity === 'exotic' ? `/static/images/extracts/flair/01A3-00001DDC.PNG` : `/static/images/extracts/flair/01A3-00001DDE.PNG`} /> : null}
            <div className='name'>{definitionItem.displayProperties && definitionItem.displayProperties.name}</div>
            <div>
              {definitionItem.itemTypeDisplayName && definitionItem.itemTypeDisplayName !== '' ? <div className='kind'>{definitionItem.itemTypeDisplayName}</div> : null}
              {item.rarity ? <div className='rarity'>{definitionItem.inventory.tierTypeName}</div> : null}
            </div>
          </div>
          {note ? <div className='note'>{note}</div> : null}
          <div className='black'>
            {this.props.viewport.width <= 600 && definitionItem.screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={`https://www.bungie.net${definitionItem.screenshot}`} />
              </div>
            ) : null}
            {woolworths[item.type] ? <Meat {...member} {...item} /> : <Default {...member} {...item} />}
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Item);
