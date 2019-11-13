import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import RecordsAlmost from '../../../components/RecordsAlmost';

class AlmostComplete extends React.Component {
  render() {
    const { t, sort } = this.props;

    return (
      <>
        <div className='almost-complete'>
          <div className='sub-header sub'>
            <div>{t('Almost complete')}</div>
          </div>
          <RecordsAlmost sort={sort} limit='200' selfLinkFrom='/triumphs/almost-complete' />
        </div>
      </>
    );
  }
}

export default compose(
  withTranslation()
)(AlmostComplete);
