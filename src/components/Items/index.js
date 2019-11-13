import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import ObservedImage from '../../components/ObservedImage';
import ProgressBar from '../../components/UI/ProgressBar';

import './styles.css';

class Items extends React.Component {
  render() {
    const { member, items, order, asTab, noBorder, showHash, inspect, action } = this.props;
    const itemComponents = member && member.data && member.data.profile.itemComponents;
    const characterUninstancedItemComponents = false //member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data;

    let output = [];

    if (!items || !items.length) {
      console.warn('No items specified');
      return null;
    }

    items.forEach((item, i) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
      const definitionBucket = item.bucketHash && manifest.DestinyInventoryBucketDefinition[item.bucketHash];

      if (!definitionItem) {
        console.log(`Items: Couldn't find item definition for ${item.itemHash}`);
        return null;
      }

      const progressData = item.itemInstanceId && itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : characterUninstancedItemComponents && characterUninstancedItemComponents[item.itemHash] ? characterUninstancedItemComponents[item.itemHash].objectives : false;

      // if (progressData) console.log(definitionItem.displayProperties.name, progressData, definitionItem)

      const bucketsToExcludeFromProgressDataDisplay = [
        4274335291 // Emblems
      ];

      const bucketName = definitionBucket && definitionBucket.displayProperties && definitionBucket.displayProperties.name && definitionBucket.displayProperties.name.replace(' ', '-').toLowerCase();

      const vendorItemStatus = item.unavailable === undefined && item.saleStatus && enums.enumerateVendorItemStatus(item.saleStatus);

      output.push({
        name: definitionItem.displayProperties && definitionItem.displayProperties.name,
        tierType: definitionItem.inventory && definitionItem.inventory.tierType,
        el: (
          <li
            key={i}
            className={cx(
              {
                tooltip: !this.props.disableTooltip,
                linked: true,
                masterworked: enums.enumerateItemState(item.state).masterworked,
                exotic: definitionItem.inventory && definitionItem.inventory.tierType === 6,
                'no-border': definitionItem.uiItemDisplayStyle === 'ui_display_style_engram' || (definitionItem.itemCategoryHashes && definitionItem.itemCategoryHashes.includes(268598612)) || (definitionItem.itemCategoryHashes && definitionItem.itemCategoryHashes.includes(18)) || noBorder,
                unavailable: (vendorItemStatus && !vendorItemStatus.success) || item.unavailable
              },
              bucketName
            )}
            data-hash={item.itemHash}
            data-instanceid={item.itemInstanceId}
            data-state={item.state}
            data-vendorhash={item.vendorHash}
            data-vendorindex={item.vendorItemIndex}
            data-vendorstatus={item.saleStatus}
            data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
            onClick={e => {
              if (action) {
                action(e, item);
              }
            }}
          >
            <div className='icon'>
              <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
            </div>
            {asTab ? (
              <div className='text'>
                <div className='name'>{definitionItem.displayProperties.name}</div>
                {showHash ? <div className='hash'>{definitionItem.hash}</div> : null}
              </div>
            ) : null}
            {progressData && progressData.filter(o => !o.complete).length > 0 && !bucketsToExcludeFromProgressDataDisplay.includes(item.bucketHash) ? (
              <ProgressBar
                progress={{
                  progress: progressData.reduce((acc, curr) => {
                    return acc + curr.progress;
                  }, 0),
                  objectiveHash: progressData[0].objectiveHash
                }}
                objective={{
                  completionValue: progressData.reduce((acc, curr) => {
                    return acc + curr.completionValue;
                  }, 0)
                }}
                hideCheck
              />
            ) : null}
            {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory && definitionItem.inventory.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
            {inspect && definitionItem.itemHash ? <Link to={{ pathname: `/inspect/${definitionItem.itemHash}`, state: { from: this.props.selfLinkFrom } }} /> : null}
          </li>
        )
      });
    });

    output = order ? orderBy(output, [i => i[order], i => i.name], ['desc', 'asc']) : output;

    return output.map(i => i.el);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(Items);
