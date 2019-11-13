import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import RecordsUnredeemed from '../../../components/RecordsUnredeemed';

class Unredeemed extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <>
        <div className='almost-complete'>
          <div className='sub-header sub'>
            <div>{t('Unredeemed triumphs')}</div>
          </div>
          <RecordsUnredeemed limit='200' selfLinkFrom='/triumphs/unredeemed' />
        </div>
      </>
    );
  }
}

export default compose(
  withTranslation()
)(Unredeemed);
