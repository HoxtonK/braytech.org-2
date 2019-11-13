import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Moment from 'react-moment';

import manifest from '../../../utils/manifest';
import packageJSON from '../../../../package.json';
import { ReactComponent as Patreon } from '../../PatreonDevice.svg';

import './styles.css';

class Footer extends React.Component {
  render() {
    const { t, linkOnClick, minimal } = this.props;

    return (
      <div id='footer'>
        <div className='wrapper'>
          <div>
            <div>© 2019 <a href='https://thomchap.com.au' target='_blank' rel='noopener noreferrer'>Tom Chapman</a></div>
            <div>{t('Version')} <span>{packageJSON.version}</span></div>
            <div>{t('VOLUSPA last indexed')} <Moment fromNow>{manifest.statistics.general.status.lastScraped}</Moment></div>
          </div>
          <ul>
            {!minimal ? (
              <>
                <li>
                  <Link to='/faq' onClick={linkOnClick}>
                    {t('FAQ')}
                  </Link>
                </li>
                <li>
                  <Link to='/credits' onClick={linkOnClick}>
                    {t('Credits')}
                  </Link>
                </li>
              </>
            ) : null}
            <li>
              <a href='https://twitter.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
                Twitter
              </a>
            </li>
            <li>
              <a href='https://discordapp.com/invite/Y68xDsG' target='_blank' rel='noopener noreferrer'>
                Discord
              </a>
            </li>
            <li>
              <a href='https://www.patreon.com/braytech' target='_blank' rel='noopener noreferrer'>
                {t('Patreon')} <Patreon />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Footer);
