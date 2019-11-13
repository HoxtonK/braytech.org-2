import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';

import fallback from './fallback';
import weapon from './weapon';
import armour from './armour';
import emblem from './emblem';
import bounty from './bounty';
import quest from './quest';
import mod from './mod';
import medal from './medal';
import ghost from './ghost';
import sparrow from './sparrow';
import subclass from './subclass';
import ui from './ui';
import sandboxPerk from './sandboxPerk';

class Item extends React.Component {
  render() {
    const { t, member, hash, instanceid, quantity, tooltips } = this.props;

    const table = this.props.table || 'DestinyInventoryItemDefinition';
    const state = (this.props.state && parseInt(this.props.state, 10)) || 0;

    let item;
    if (hash === '343') {
      item = {
        redacted: true
      };
    } else {
      item = cloneDeep(manifest[table][hash]);
    }

    if (!item) {
      console.warn('Hash not found');
      return null;
    }

    if (instanceid && member.data && member.data.profile.itemComponents.instances.data[instanceid]) {
      let itemComponents = member.data.profile.itemComponents;

      item.itemComponents = {
        state,
        instance: itemComponents.instances.data[instanceid] ? itemComponents.instances.data[instanceid] : false,
        sockets: itemComponents.sockets.data[instanceid] ? itemComponents.sockets.data[instanceid].sockets : false,
        perks: itemComponents.perks.data[instanceid] ? itemComponents.perks.data[instanceid].perks : false,
        stats: itemComponents.stats.data[instanceid] ? itemComponents.stats.data[instanceid].stats : false,
        objectives: itemComponents.objectives.data[instanceid] ? itemComponents.objectives.data[instanceid].objectives : false
      };
    } else if (instanceid && tooltips.itemComponents[instanceid]) {
      item.itemComponents = tooltips.itemComponents[instanceid];
    } else {
      item.itemComponents = false;
    }

    if (member.data.profile && member.data.profile.characterUninstancedItemComponents && member.data.profile.characterUninstancedItemComponents[member.characterId].objectives && member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[hash]) {
      if (item.itemComponents) {
        item.itemComponents.objectives = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[hash].objectives;
      } else {
        item.itemComponents = {
          objectives: member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data[hash].objectives
        };
      }
    }

    if (instanceid && member.data.profile && member.data.profile.characterInventories && member.data.profile.characterInventories.data && member.data.profile.characterInventories.data[member.characterId] && member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === instanceid)) {
      if (item.itemComponents) {
        item.itemComponents.item = member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === instanceid);
      } else {
        item.itemComponents = {
          item: member.data.profile.characterInventories.data[member.characterId].items.find(i => i.itemInstanceId === instanceid)
        };
      }
    }

    item.quantity = quantity || 1;

    let kind, tier, black, hideRarity, masterwork;

    if (item.itemType !== undefined) {
      if (item.itemType === 1) {
        kind = 'ui';
        black = ui(item);
      } else if (item.itemType === 3) {
        kind = 'weapon';
        let type = weapon(item, member, tooltips.settings.detailedMode);
        black = type.el;
        masterwork = type.masterwork;
      } else if (item.itemType === 2) {
        kind = 'armour';
        let type = armour(item, member, tooltips.settings.detailedMode);
        black = type.el;
        masterwork = type.masterwork;
      } else if (item.itemType === 14) {
        kind = 'emblem';
        black = emblem(t, item);
      } else if (item.itemType === 16) {
        kind = 'ui subclass';
        hideRarity = true;
        black = subclass(item, member);
      } else if (item.itemType === 19) {
        kind = 'mod';
        black = mod(item);
      } else if (item.itemType === 9) {
        kind = 'cosumable';
        black = ui(item);
      } else if (item.itemType === 20) {
        kind = 'material';
        black = ui(item);
      } else if (item.itemType === 21) {
        kind = 'ship';
        black = sparrow(item, tooltips.settings.detailedMode);
      } else if (item.itemType === 22) {
        kind = 'sparrow';
        black = sparrow(item, tooltips.settings.detailedMode);
      } else if (item.itemType === 24) {
        kind = 'ghost';
        black = ghost(item, tooltips.settings.detailedMode);
      } else if (item.itemType === 12) {
        kind = 'quest';
        black = quest(item);
      } else if (item.itemType === 26) {
        kind = 'bounty';
        hideRarity = true;
        black = bounty(item);
      } else if (item.itemType === 50) {
        kind = 'ui no-name';
        tier = 'basic';
        hideRarity = true;
        black = fallback(item);
      } else if (item.itemType === 0) {
        kind = 'no-type';
        black = fallback(item);
      } else {
        kind = 'ui';
        tier = 'basic';
        hideRarity = true;
        black = fallback(item);
      }
    }

    if (table === 'DestinySandboxPerkDefinition') {
      kind = 'ui name-only sandbox-perk';
      black = sandboxPerk(item);
    }

    if (table === 'DestinyHistoricalStatsDefinition') {
      kind = 'ui name-only';
      black = medal(item);
    }

    if (this.props.tooltiptype) {
      kind = this.props.tooltiptype;
    }

    if (item.inventory) {
      switch (item.inventory.tierType) {
        case 6:
          tier = 'exotic';
          break;
        case 5:
          tier = 'legendary';
          break;
        case 4:
          tier = 'rare';
          break;
        case 3:
          tier = 'uncommon';
          break;
        case 2:
          tier = 'common';
          break;
        default:
          tier = 'common';
      }
    }

    if (item.redacted) {
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
    } else {
      let name = item.displayProperties && item.displayProperties.name;
      name = table === 'DestinyHistoricalStatsDefinition' ? item.statName : name;

      let note = false;

      if (!item.itemComponents && this.props.uninstanced) {

        note = t('Non-instanced item (displaying collections roll)');

      } else if (this.props.vendorhash && this.props.vendorindex && this.props.vendorstatus) {

        const vendorItemStatus = parseInt(this.props.vendorstatus, 10);

        if (vendorItemStatus !== 0) {
          const definitionVendor = manifest.DestinyVendorDefinition[this.props.vendorhash];
          const itemDetails = definitionVendor && definitionVendor.itemList && definitionVendor.itemList[this.props.vendorindex];

          note = itemDetails && itemDetails.failureIndexes && definitionVendor.failureStrings[itemDetails.failureIndexes[0]];
        }

      }

      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', kind, tier, { 'is-masterworked': masterwork })}>
            <div className='header'>
              {masterwork ? <ObservedImage className={cx('image', 'bg')} src={tier === 'exotic' ? `/static/images/extracts/flair/01A3-00001DDC.PNG` : `/static/images/extracts/flair/01A3-00001DDE.PNG`} /> : null}
              <div className='name'>{name}</div>
              <div>
                {item.itemTypeDisplayName && item.itemTypeDisplayName !== '' ? <div className='kind'>{item.itemTypeDisplayName}</div> : null}
                {!hideRarity && item.inventory ? <div className='rarity'>{item.inventory.tierTypeName}</div> : null}
              </div>
            </div>
            {note ? <div className='note'>{note}</div> : null}
            <div className='black'>
              {this.props.viewport.width <= 600 && item.screenshot ? (
                <div className='screenshot'>
                  <ObservedImage className='image' src={`https://www.bungie.net${item.screenshot}`} />
                </div>
              ) : null}
              {black}
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
    viewport: state.viewport,
    tooltips: state.tooltips
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Item);
