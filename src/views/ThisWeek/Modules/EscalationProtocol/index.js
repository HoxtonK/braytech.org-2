import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Collectibles from '../../../../components/Collectibles';
import Items from '../../../../components/Items';

import './styles.css';

class EscalationProtocol extends React.Component {
  render() {
    const { t, cycleInfo } = this.props;

    const rotation = {
      1: {
        boss: t('Nur Abath, Crest of Xol'),
        items: [
          // https://github.com/Bungie-net/api/issues/732
          3243866699 // Worldline Ideasthesia: Torsion
        ],
        collectibles: [
          1041306082 // IKELOS_SG
        ]
      },
      2: {
        boss: t('Kathok, Roar of Xol'),
        triumphs: [],
        items: [
          3243866698 // Worldline Ideasthesia: Anarkhiia
        ],
        collectibles: [
          2998976141 // IKELOS_SMG
        ]
      },
      3: {
        boss: t('Damkath, The Mask'),
        triumphs: [],
        items: [
          // https://youtu.be/lrPf16ZHevU?t=104
          3243866697 //Worldline Ideasthesia: Cavalry
        ],
        collectibles: [
          1203091693 // IKELOS_SR
        ]
      },
      4: {
        boss: t('Naksud, the Famine'),
        triumphs: [],
        items: [
          3243866696 //  Worldline Ideasthesia: Faktura
        ],
        collectibles: [
          1041306082, // IKELOS_SG
          2998976141, // IKELOS_SMG
          1203091693 // IKELOS_SR
        ]
      },
      5: {
        boss: t('Bok Litur, Hunger of Xol'),
        triumphs: [],
        items: [
          3243866703 // Worldline Ideasthesia: Black Square
        ],
        collectibles: [
          1041306082, // IKELOS_SG
          2998976141, // IKELOS_SMG
          1203091693 // IKELOS_SR
        ]
      }
    };

    return (
      <React.Fragment key='escalation-protocol'>
        <div className='module-header'>
          <div className='sub-name'>{t('Escalation Protocol')}</div>
          <div className='name'>{rotation[cycleInfo.week.ep].boss}</div>
        </div>
        <h4>{t('Collectibles')}</h4>
        <ul className='list collection-items'>
          <Collectibles selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.ep].collectibles} />
        </ul>
        <h4>{t('Catalyst item')}</h4>
        <ul className='list inventory-items as-tab'>
          <Items
            items={rotation[cycleInfo.week.ep].items.map(i => {
              return {
                itemHash: i
              };
            })}
            asTab
          />
        </ul>
        <div className='aside'>{t('Braytech can not determine which Worldline Zero catalyst components you have attained, but it can tell you which bosses drop which items in case you happened to be keeping a list.')}</div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(EscalationProtocol);
