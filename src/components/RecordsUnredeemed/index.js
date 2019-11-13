import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import { Records, unredeemed } from '../Records';

class RecordsUnredeemed extends React.Component {
  render() {
    const { member, limit, selfLinkFrom = false } = this.props;
    
    const hashes = unredeemed(member);

    return (
      <>
        <ul className={cx('list record-items')}>
          <Records selfLink hashes={hashes} ordered='rarity' limit={limit} selfLinkFrom={selfLinkFrom} />
        </ul>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    triumphs: state.triumphs
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(RecordsUnredeemed);