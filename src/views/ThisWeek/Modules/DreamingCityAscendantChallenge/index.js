import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Records from '../../../../components/Records';

import './styles.css';

class DreamingCityAscendantChallenge extends React.Component {
  render() {
    const { t, cycleInfo } = this.props;

    const rotation = {
      1: {
        challenge: t('Ouroborea'),
        region: t("Aphelion's Rest"),
        triumphs: [
          3024450470, // Nigh II (Eggs)
          1842255608, // Imponent I (Bones)
          2856474352 // Eating Your Own Tail (Time Trial)
        ],
        items: [],
        collectibles: [],
        checklists: [
          {
            checklistId: 2609997025, // corrupted eggs
            items: [1084474576, 1084474577, 1084474591]
          },
          {
            checklistId: 1297424116, // ahamkara bones
            items: [1387596463]
          }
        ]
      },
      2: {
        challenge: t('Forfeit Shrine'),
        region: t('Gardens of Esila'),
        triumphs: [
          2974117611, // Imponent II (Eggs)
          1842255611, // Heresiology (Bones)
          3422458392 // Never Forfeit (Time Trial)
        ],
        items: [],
        collectibles: [],
        checklists: [
          {
            checklistId: 2609997025, // corrupted eggs
            items: [1034141726, 1067696996, 1067696997, 1067696998, 1084474590]
          },
          {
            checklistId: 1297424116, // ahamkara bones
            items: [1387596460]
          }
        ]
      },
      3: {
        challenge: t('Shattered Ruins'),
        region: t('Spine of Keres'),
        triumphs: [
          3024450469, // Imponent V (Eggs)
          1859033176, // Ecstasiate I (Bones)
          2858561750 // Shatter That Record (Time Trial)
        ],
        items: [],
        collectibles: [],
        checklists: [
          {
            checklistId: 2609997025, // corrupted eggs
            items: [1067696992, 1067696993, 1067696999, 1067697005, 1084474583]
          },
          {
            checklistId: 1297424116, // ahamkara bones
            items: [1370818879]
          }
        ]
      },
      4: {
        challenge: t('Keep of Honed Edges'),
        region: t("Harbinger's Seclude"),
        triumphs: [
          2974117605, // Imponent IV (Eggs)
          1842255614, // Ecstasiate II (Bones)
          3578247132 // Honed for Speed (Time Trial)
        ],
        items: [],
        collectibles: [],
        checklists: [
          {
            checklistId: 2609997025, // corrupted eggs
            items: [1084474578, 1084474579, 1118029876, 1118029877, 1118029882]
          },
          {
            checklistId: 1297424116, // ahamkara bones
            items: [1387596457]
          }
        ]
      },
      5: {
        challenge: t('Agonarch Abyss'),
        region: t('Bay of Drowned Wishes'),
        triumphs: [
          3024450465, // Palingenesis I (Eggs)
          1859033177, // Cosmogyre IV (Bones)
          990661957 // Argonach Agony (Time Trial)
        ],
        items: [],
        collectibles: [],
        checklists: [
          {
            checklistId: 2609997025, // corrupted eggs
            items: [1084474580, 1084474581, 1084474582]
          },
          {
            checklistId: 1297424116, // ahamkara bones
            items: [1370818878]
          }
        ]
      },
      6: {
        challenge: t('Cimmerian Garrison'),
        region: t('Chamber of Starlight'),
        triumphs: [
          3024450471, // Nigh I (Eggs)
          1859033173, // Brephos III (Bones)
          147323772 // Run the Gauntlet (Time Trial)
        ],
        items: [],
        collectibles: [],
        checklists: [
          {
            checklistId: 2609997025, // corrupted eggs
            items: [1067696994, 1067696995, 1067697004]
          },
          {
            checklistId: 1297424116, // ahamkara bones
            items: [1370818866]
          }
        ]
      }
    };

    return (
      <React.Fragment key='ascendant-challenge'>
        <div className='module-header'>
          <div className='sub-name'>{t('Ascendant Challenge')}</div>
          <div className='name'>
            {rotation[cycleInfo.week.ascendant].challenge}, {rotation[cycleInfo.week.ascendant].region}
          </div>
        </div>
        <h4>{t('Triumphs')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.ascendant].triumphs} ordered />
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
)(DreamingCityAscendantChallenge);
