import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

import { ReactComponent as Diagram1 } from './collectible_and_record_diagram.svg';

import './styles.css';

class FAQ extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t } = this.props;

    const qa = [
      {
        k: 'braytech',
        q: t('Describing the anatomy of collectibles and records'),
        a: [
          <Markdown className='markdown' source={t("Commonly asked, \"What is the funny percentage to the right of collectibles and records?\"\n\nIt's a percentage of players who've either discovered or redeemed the item. Every few days, VOLUSPA collects data from 1.2 million Destiny players and takes note of who's got what.\n\nIt's been a hot topic as to whether it's accurate or useful and the truth is that all statistics are useless and dumb _unless_ you've included every single piece of data possible.\n\nThat said, it's a fair sample size and ever so slightly weighted towards more commited players (percentages may appear higher rather than lower due to the skill and attention of the users that are monitored).")} />,
          <Diagram1 />
        ]
      },
      {
        k: 'braytech-beta',
        q: t("Braytech Beta won't update to the newest version"),
        a: [
          <Markdown className='markdown' source={t('From _Settings_ you can try a variety of things. Start with _Update service worker_. Wait a small time and you should be prompted to restart to update.\n\nIf this fails, you can try _Reload_. If all is lost, _Dump service worker_.')} />
        ]
      },
      {
        k: 'api',
        q: t("Clan Historical Stats don't match [other thing]"),
        a: [
          <Markdown className='markdown' source={t("There are multiple sources for stats in Destiny. Clan Historical Stats is based on the less intensive HistoricalStats API endpoint.\n\nThe most accurate source for statistics is PGCRs. To display stats in the manner seen on Clan Historical Stats would require downloading terabytes of data from Bungie servers. This said, it's accurate enough fo some friendly competititon.")} />
        ]
      }
    ];

    return (
      <div className='view' id='faq'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Frequently Asked Questions')}</div>
          </div>
        </div>
        <div className='padder'>
          <div className='module overview'>
            <h4>Braytech</h4>
            <ul>
              {qa
                .filter(q => q.k === 'braytech')
                .map((qa, index) => {
                  return (
                    <li key={index} className='qa'>
                      {qa.q}
                    </li>
                  );
                })}
            </ul>
            <h4>Braytech Beta</h4>
            <ul>
              {qa
                .filter(q => q.k === 'braytech-beta')
                .map((qa, index) => {
                  return (
                    <li key={index} className='qa'>
                      {qa.q}
                    </li>
                  );
                })}
            </ul>
            <h4>API</h4>
            <ul>
              {qa
                .filter(q => q.k === 'api')
                .map((qa, index) => {
                  return (
                    <li key={index} className='qa'>
                      {qa.q}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className='module faq'>
            <div className='k'>
              {qa.map((qa, index) => {
                return (
                  <div key={index} className='qa'>
                    <div className='q'>{qa.q}</div>
                    <div className='a'>
                      {qa.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(),
  withTranslation()
)(FAQ);
