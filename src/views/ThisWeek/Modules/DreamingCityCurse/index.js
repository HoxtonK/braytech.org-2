import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Records from '../../../../components/Records';

import './styles.css';

class DreamingCityCurse extends React.Component {
  render() {
    const { t, cycleInfo } = this.props;

    const rotation = {
      1: {
        strength: t('Weak'),
        triumphs: [
          // DestinyRecordDefinition.Hashes
          2144075646, // The Scorn Champion (Heroic Blind Well)
          3675740696, // Hidden Riches (Ascendant Chests)
          2769541312, // Broken Courier (Weekly Mission)
          1768837759 // Bridge Troll (Hidden Boss in Weekly Mission)
        ],
        items: [], // DestinyItemDefinition.Hashes
        collectibles: [], // DestinyCollectableDefinition.Hashes
        checklists: []
      },
      2: {
        strength: t('Middling'),
        triumphs: [
          2144075647, // The Hive Champion (Heroic Blind Well)
          3675740699, // Bolder Fortunes (Ascendant Chests)
          2419556790, // The Oracle Engine (Weekly Mission)
          2968758821, // Aggro No (Hidden Boss in Weekly Mission)
          202137963 // Twinsies (Kill ogres in Weekly Mission within 5 secs of each other)
        ],
        items: [],
        collectibles: [],
        checklists: []
      },
      3: {
        strength: t('Full strength'),
        triumphs: [
          2144075645, // The Taken Champion (Heroic Blind Well)
          3675740698, // War Chests (Ascendant Chests)
          749838902, // Into the Unknown (Visit Mara)
          2358176597, // Dark Monastery (Weekly Mission)
          1236992882, // Odynom-Nom-Nom (Hidden Boss in Weekly Mission)
          1842255615, // Ecstasiate III (Bones in Weekly Mission)
          1842255613 // Fideicide II (Bones in Mara's Throne World)
        ],
        items: [],
        collectibles: [],
        checklists: [
          {
            checklistId: 1297424116, // ahamkara bones
            items: [1387596458, 1387596456]
          }
        ]
      }
    };

    return (
      <React.Fragment key='city-curse'>
        <div className='module-header'>
          <div className='sub-name'>{t("Savathûn's Curse")}</div>
          <div className='name'>
            {t('Week')} {cycleInfo.week.curse}: {rotation[cycleInfo.week.curse].strength}
          </div>
        </div>
        <h4>{t('Triumphs')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.curse].triumphs} ordered />
        </ul>
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
)(DreamingCityCurse);
