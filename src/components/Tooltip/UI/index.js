import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';

import Default from './Default';

const woolworths = {
  
}

class UI extends React.Component {
  render() {
    const { t, member, tooltips } = this.props;

    const item = {
      hash: this.props.hash,
      table: this.props.table,
      instanceId: this.props.instanceid || false,
      itemComponents: false,
      quantity: parseInt(this.props.quantity, 10) || 1,
      state: (this.props.state && parseInt(this.props.state, 10)) || 0,
      rarity: 'common',
      type: 'ui'
    };

    const definition = manifest[item.table][item.hash];

    if (!definition) {
      return null;
    }

    if (definition.redacted) {
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

    let note = false;
    if (!item.itemComponents && this.props.uninstanced) {
      note = t('Non-instanced item (displaying collections roll)');
    }

    const Meat = item.type && woolworths[item.type];

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', item.type, item.rarity, { 'masterworked': item.masterwork || (item.masterworkInfo && item.masterworkInfo.tier === 10) })}>
          <div className='header'>
            {item.masterwork || (item.masterworkInfo && item.masterworkInfo.tier === 10) ? <ObservedImage className={cx('image', 'bg')} src={item.rarity === 'exotic' ? `/static/images/extracts/flair/01A3-00001DDC.PNG` : `/static/images/extracts/flair/01A3-00001DDE.PNG`} /> : null}
            <div className='name'>{definition.displayProperties && definition.displayProperties.name}</div>
            <div>
              {definition.itemTypeDisplayName && definition.itemTypeDisplayName !== '' ? <div className='kind'>{definition.itemTypeDisplayName}</div> : null}
              {item.rarity && definition.inventory && definition.inventory.tierTypeName ? <div className='rarity'>{definition.inventory.tierTypeName}</div> : null}
            </div>
          </div>
          {note ? <div className='note'>{note}</div> : null}
          <div className='black'>
            {this.props.viewport.width <= 600 && definition.screenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={`https://www.bungie.net${definition.screenshot}`} />
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
)(UI);
