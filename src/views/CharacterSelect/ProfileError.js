import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import Button from '../../components/UI/Button';

class ProfileError extends React.Component {
  render() {
    const { t, error } = this.props;

    if (error.ErrorCode && error.ErrorStatus && error.Message) {
      return (
        <div className='error'>
          <div className='sub-header'>
            <div>{t('Bungie error')}</div>
          </div>
          <p>
            {error.ErrorCode}: {error.ErrorStatus}
          </p>
          <p>{error.Message}</p>
        </div>
      );
    }

    if (error.ErrorCode === 'private') {
      return (
        <div className='error'>
          <div className='sub-header'>
            <div>{t('Private profile')}</div>
          </div>
          <p>{t("Your profile's progression data isn't available. Your profile may be set to private on Bungie.net.")}</p>
          <p>{t("You may change your privacy settings on Bungie.net or authenticate Braytech with Bungie.net")}</p>
          <Button
            text={t('Go to Bungie.net')}
            action={() => {
              window.open('https://www.bungie.net/en/Profile/Settings?category=Privacy', '_blank');
            }}
          />
        </div>
      );
    }

    return (
      <div className='error'>
        <div className='sub-header'>
          <div>{t('Error')}</div>
        </div>
        <p>{error.message}</p>
      </div>
    );
  }
}

ProfileError = compose(withTranslation())(ProfileError);

export default ProfileError;
