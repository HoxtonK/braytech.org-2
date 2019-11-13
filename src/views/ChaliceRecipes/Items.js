import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';

class Items extends React.Component {
  render() {
    const { items, action } = this.props;

    let output = [];

    items.forEach((item, i) => {
      let definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (!definitionItem) {
        console.log(`Items: Couldn't find item definition for ${item.itemHash}`, item);
        return;
      }

      output.push(
        <ul className='list' key={i}>
          <li
            className={cx({
              tooltip: !this.props.disableTooltip,
              linked: true,
              active: item.active
            })}
            data-hash={item.itemHash}
            data-instanceid={item.itemInstanceId}
            data-state={item.state}
            onClick={e => {
              if (action) {
                action(e, item);
              }
            }}
          >
            <div className='icon'>
              <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{definitionItem.displayProperties.name}</div>
            </div>
          </li>
          <li
            className={cx('apply', {
              linked: true,
              active: item.active
            })}
            onClick={e => {
              if (action) {
                action(e, item);
              }
            }}
          >
            <i className='segoe-uniE176' />
          </li>
        </ul>
      );
    });

    return output;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(Items);
