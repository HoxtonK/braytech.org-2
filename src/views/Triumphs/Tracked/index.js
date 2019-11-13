import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import RecordsTracked from '../../../components/RecordsTracked';

class Tracked extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <>
        <div className='almost-complete'>
          <div className='sub-header sub'>
            <div>{t('Tracked triumphs')}</div>
          </div>
          <RecordsTracked limit='200' selfLinkFrom='/triumphs/tracked' />
        </div>
      </>
    );
  }
}

export default compose(
  withTranslation()
)(Tracked);
