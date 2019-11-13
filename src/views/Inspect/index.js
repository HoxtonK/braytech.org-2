import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import { damageTypeToString, ammoTypeToString, breakerTypeToIcon } from '../../utils/destinyUtils';
import { sockets } from '../../utils/destinyItems/sockets';
import { stats, statsMs } from '../../utils/destinyItems/stats';
import { masterwork } from '../../utils/destinyItems/masterwork';
import ObservedImage from '../../components/ObservedImage';

import './styles.css';

class Inspect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.kind !== prevProps.match.params.kind) {
      window.scrollTo(0, 0);
    }
  }

  toggleLore = () => {
    if (!this.state.loreOpen) {
      this.setState({ loreOpen: true });
    } else {
      this.setState({ loreOpen: false });
    }
  };

  render() {
    const { t, member, tooltips } = this.props;

    const item = {
      itemHash: this.props.match.params.hash,
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

    item.primaryStat = (definitionItem.itemType === 2 || definitionItem.itemType === 3) &&
      definitionItem.stats &&
      !definitionItem.stats.disablePrimaryStatDisplay &&
      definitionItem.stats.primaryBaseStatHash && {
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

    console.log(item);

    // weapon damage type
    let damageTypeHash = definitionItem.itemType === enums.DestinyItemType.Weapon && definitionItem.damageTypeHashes[0];
    damageTypeHash = item.itemComponents && item.itemComponents.instance ? item.itemComponents.instance.damageTypeHash : damageTypeHash;

    const definitionDamageType = damageTypeHash && manifest.DestinyDamageTypeDefinition[damageTypeHash];
    const definitionBreakerType = definitionItem.breakerTypeHash && manifest.DestinyBreakerTypeDefinition[definitionItem.breakerTypeHash];

    // let backLinkPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/collections';

    return (
      <div className={cx('view', { weapon: definitionItem.itemType === enums.DestinyItemType.Weapon } )} id='inspect'>
        {/* {definitionItem.screenshot && definitionItem.screenshot !== '' ? <ObservedImage className='image screenshot' src={`https://www.bungie.net${definitionItem.screenshot}`} /> : null} */}
        {/* {definitionItem.secondaryIcon && definitionItem.secondaryIcon !== '' ? <ObservedImage className='image foundry' src={`https://www.bungie.net${definitionItem.secondaryIcon}`} /> : null} */}
        <div className='row header'>
          <div className={cx('rarity', item.rarity)} />
          <div className='icon'>{definitionItem.displayProperties.icon ? <ObservedImage className='image' src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} /> : null}</div>
          <div className='text'>
            <div className='name'>{definitionItem.displayProperties.name}</div>
            <div className='type'>{definitionItem.itemTypeDisplayName}</div>
            <div className='description'>{definitionItem.displayProperties.description}</div>
          </div>
        </div>
        <div className='row'>
          {item.stats ? (
            <div className='module stats'>
              {item.stats.map(s => {
                // map through stats

                const masterwork = (item.masterworkInfo && item.masterworkInfo.statHash === s.statHash && item.masterworkInfo.statValue) || 0;
                const base = s.value - masterwork;

                return (
                  <div key={s.statHash} className='stat'>
                    <div className='name'>{s.displayProperties.name}</div>
                    <div className={cx('value', { bar: s.bar })}>
                      {s.bar ? (
                        <>
                          <div className='bar' data-value={base} style={{ width: `${base}%` }} />
                          <div className='bar masterwork' data-value={masterwork} style={{ width: `${masterwork}%` }} />
                          <div className='int'>{s.value}</div>
                        </>
                      ) : (
                        <>
                          {s.value} {statsMs.includes(s.statHash) && 'ms'}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          {item.primaryStat && definitionItem.itemType === enums.DestinyItemType.Weapon ? (
            <div className='module primary-stat weapon'>
              <div className='slot'>
                <div className={cx('icon', ammoTypeToString(definitionItem.equippingBlock.ammoType).toLowerCase())} />
                <div className='text'>{ammoTypeToString(definitionItem.equippingBlock.ammoType)}</div>
              </div>
              {definitionItem.breakerType > 0 ? (
                <div className='breaker-type'>
                  <div className='icon'>{breakerTypeToIcon(definitionItem.breakerTypeHash)}</div>
                  <div className='text'>
                    <div className='name'>{definitionBreakerType.displayProperties.name}</div>
                    <div className='description'>
                      <p>{definitionBreakerType.displayProperties.description}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={cx('power', damageTypeToString(damageTypeHash).toLowerCase())}>
                <div className={cx('icon', damageTypeToString(damageTypeHash).toLowerCase())} />
                <div className='text'>{definitionDamageType.displayProperties.name}</div>
              </div>
            </div>
          ) : null}
          {item.sockets && item.sockets.sockets ? (
            <div className='module sockets'>
              {item.sockets.sockets.filter(s => (s.isPerk || s.isIntrinsic) && !s.isTracker).map(s => {
                // map through sockets

                return (
                  <div key={s.socketIndex} className={cx('socket', { intrinsic: s.isIntrinsic, columned: s.plugOptions.length > 10 })}>
                    {s.plugOptions.map((p, i) => {
                      return (
                        <div key={i} className={cx('plug', { active: p.isActive })}>
                          <div className='icon tooltip'>
                            <ObservedImage src={`https://www.bungie.net${p.plugItem.displayProperties.icon}`} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    );
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
)(Inspect);
