import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';

class Stat extends React.Component {
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

    // name
    const name = definition.statName;
  
    // description
    const description = definition.statDescription;

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', item.type, item.rarity )}>
          <div className='header'>
            <div className='name'>{name}</div>
            <div />
          </div>
          <div className='black'>
            <div className='description'>
              <pre>{description}</pre>
            </div>
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
)(Stat);
