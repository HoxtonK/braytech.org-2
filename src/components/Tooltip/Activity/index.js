import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';
import { checklists, lookup } from '../../../utils/checklists';

import './styles.css';

class Activity extends React.Component {
  render() {
    const { t, hash, mode, playlist } = this.props;

    const definitionActivity = manifest.DestinyActivityDefinition[hash];
    const definitionActivityMode = manifest.DestinyActivityModeDefinition[mode];
    const definitionActivityModeParent = definitionActivityMode && definitionActivityMode.parentHashes && definitionActivityMode.parentHashes.length && manifest.DestinyActivityModeDefinition[definitionActivityMode.parentHashes[0]];
    const definitionActivityPlaylist = manifest.DestinyActivityDefinition[playlist];
    const definitionActivityType = definitionActivityPlaylist && definitionActivityPlaylist.activityTypeHash && manifest.DestinyActivityTypeDefinition[definitionActivityPlaylist.activityTypeHash];
    const definitionPlaceDefinition = definitionActivity && definitionActivity.placeHash && manifest.DestinyPlaceDefinition[definitionActivity.placeHash];

    if (!definitionActivity) {
      console.warn('Hash not found');
      return null;
    }

    if (definitionActivity.redacted) {
      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', 'common')}>
            <div className='header'>
              <div className='name'>Classified</div>
              <div>
                <div className='kind'>Insufficient clearance</div>
              </div>
            </div>
            <div className='black'>
              <div className='description'>
                <pre>Keep it clean.</pre>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      const activityType = (hash, activityTypeHash, activityModeHashes = []) => {
        if ([53954174, 78673128, 96442917, 122988657, 185515551, 319240296, 320680002, 340004423, 359488722, 449926115, 539897061, 622895925, 625165976, 632790902, 723733266, 785871069, 789332628, 801458995, 808931822, 856342832, 919252154, 963938931, 993905880, 999972877, 1018040791, 1018385878, 1063969232, 1107208644, 1159314159, 1225970098, 1228327586, 1254990192, 1265390366, 1275562432, 1279862229, 1289867188, 1294490226, 1302437673, 1333621919, 1416597166, 1418217191, 1466550401, 1491022087, 1503376677, 1570598249, 1643069750, 1651979106, 1657356109, 1671235700, 1682036469, 1725302079, 1740310101, 1773400654, 1783922093, 1800749202, 1811228210, 1823921651, 1824067376, 1829866365, 1874578888, 1956541147, 1969800443, 1971154629, 1981289329, 1987624188, 2067233851, 2069143995, 2174556965, 2219006909, 2231840083, 2245202378, 2250935166, 2258680077, 2302677459, 2307090074, 2310677039, 2340776707, 2517540332, 2574607799, 2665134323, 2675435236, 2737739053, 2752743635, 2831644165, 2949941834, 2966841322, 3002511278, 3015346707, 3033151437, 3042112297, 3069330044, 3140524926, 3148431353, 3211568383, 3248193378, 3255524827, 3277510674, 3283790633, 3289681664, 3304835347, 3370527053, 3384410381, 3485876484, 3500791146, 3601218952, 3644215993, 3645117987, 3664729722, 3664915501, 3691789482, 3700722865, 3752039537, 3780356141, 3836086286, 3872525353, 3909841711, 3920569453, 4094398454, 4238309598].includes(hash)) {
          return 'adventure';
        } else if (enums.ordealHashes.includes(hash)) {
          return 'nightfall-ordeal';
        } else if (activityTypeHash === 838603889) {
          // Forge Ignition
          return 'forge';
        } else if (activityTypeHash === 400075666) {
          // The Menagerie
          return 'menagerie';
        } else if (activityModeHashes.includes(1686739444)) {
          return 'story';
        } else if (activityModeHashes.includes(2394616003)) {
          return 'strike';
        } else if (activityModeHashes.includes(3497767639)) {
          return 'patrol';
        } else if (activityModeHashes.includes(1164760504)) {
          return 'crucible';
        } else if (activityTypeHash === 2043403989) {
          return 'raid';
        } else if (activityModeHashes.includes(3894474826)) {
          return 'reckoning';
        } else if (activityModeHashes.includes(1418469392)) {
          // Gambit Prime
          return 'gambit';
        } else if (activityModeHashes.includes(1848252830)) {
          // Gambit
          return 'gambit';
        } else if (activityTypeHash === 332181804) {
          return 'nightmare-hunt';
        } else if (hash === 2999911583) {
          return 'vex-offensive';
        } else if (activityModeHashes.includes(608898761)) {
          return 'dungeon';
        }
      };

      const modeFiltered = activityType(definitionActivity.hash, definitionActivity.activityTypeHash, definitionActivity.activityModeHashes ? definitionActivity.activityModeHashes.concat([mode]) : [mode]);

      let activityTypeDisplay = {
        name: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown'),

        mode: definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name,

        description: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.description ? definitionActivity.selectionScreenDisplayProperties.description : definitionActivity.displayProperties && definitionActivity.displayProperties.description ? definitionActivity.displayProperties.description : t('Unknown'),

        destination:
          definitionActivity.destinationHash && manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].displayProperties
            ? {
                ...manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].displayProperties,
                place: manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].placeHash && manifest.DestinyPlaceDefinition[manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].placeHash].displayProperties && manifest.DestinyPlaceDefinition[manifest.DestinyDestinationDefinition[definitionActivity.destinationHash].placeHash].displayProperties.name
              }
            : false,

        activityLightLevel: definitionActivity.activityLightLevel && definitionActivity.activityLightLevel !== 10 && definitionActivity.activityLightLevel,

        pgcrImage: definitionActivity.pgcrImage,

        icon: <span className='destiny-patrol' />
      };

      // console.log(activityTypeDisplay, definitionActivity, mode, definitionActivityPlaylist)

      if (definitionActivity.placeHash === 2961497387) {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: manifest.DestinyPlaceDefinition[2961497387].displayProperties.name,
          destination: false,
          description: false,
          activityLightLevel: false
        };
      }

      if (modeFiltered === 'patrol') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          destination: {
            name: definitionPlaceDefinition.displayProperties.name,
            place: false
          },
          description: manifest.DestinyActivityTypeDefinition[3497767639].displayProperties.description,
          activityLightLevel: false,
          mode: definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name
        };
      }

      if (modeFiltered === 'story') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          mode: manifest.DestinyActivityTypeDefinition[1686739444].displayProperties.name,
          className: 'story',
          icon: (
            <span className='destiny-quest2'>
              <span className='path1' />
              <span className='path2' />
              <span className='path3' />
              <span className='path4' />
              <span className='path5' />
              <span className='path6' />
            </span>
          )
        };
      }

      if (modeFiltered === 'crucible') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: definitionActivityPlaylist && definitionActivityPlaylist.displayProperties ? definitionActivityPlaylist.displayProperties.name : t('Unknown'),
          mode: definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name,
          description: definitionActivityPlaylist && definitionActivityPlaylist.displayProperties ? definitionActivityPlaylist.displayProperties.description : t('Unknown'),
          destination: {
            name: definitionActivity.displayProperties.name,
            place: definitionActivity.displayProperties.description
          },
          className: 'crucible',
          activityLightLevel: false,
          icon: <span className='destiny-crucible' />
        };

        // Survival, Survival: Freelance
        if (definitionActivityPlaylist && [135537449, 740891329].includes(definitionActivityPlaylist.hash)) {
          activityTypeDisplay.name = definitionActivityPlaylist.displayProperties.name;
        }
      }

      if (modeFiltered === 'raid') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: definitionActivity.displayProperties.name,
          description: definitionActivity.displayProperties.description,
          mode: definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name,
          className: 'raid',
          icon: <span className='destiny-raid' />
        };
      }

      if (modeFiltered === 'forge') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: definitionActivityPlaylist && definitionActivityPlaylist.displayProperties ? definitionActivityPlaylist.displayProperties.name : t('Unknown'),
          description: definitionActivityPlaylist && definitionActivityPlaylist.displayProperties ? definitionActivityPlaylist.displayProperties.description : t('Unknown'),
          mode: definitionActivityType && definitionActivityType.displayProperties && definitionActivityType.displayProperties.name,
          activityLightLevel: definitionActivityPlaylist.activityLightLevel,
          className: 'forge',
          pgcrImage: definitionActivityPlaylist.pgcrImage,
          icon: <span className='destiny-black_armory_forge' />
        };
      }

      if (modeFiltered === 'menagerie') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          destination: {
            name: activityTypeDisplay.destination.name,
            place: false
          },
          mode: false,
          activityLightLevel: definitionActivityPlaylist.activityLightLevel,
          className: 'menagerie',
          icon: (
            <span className='destiny-menagerie'>
              <span className='path1' />
              <span className='path2' />
              <span className='path3' />
              <span className='path4' />
              <span className='path5' />
              <span className='path6' />
              <span className='path7' />
              <span className='path8' />
              <span className='path9' />
            </span>
          )
        };
      }

      if (modeFiltered === 'reckoning') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          mode: definitionActivity.originalDisplayProperties && definitionActivity.originalDisplayProperties.name,
          className: 'reckoning',
          icon: <span className='destiny-reckoning' />
        };
      }

      if (modeFiltered === 'gambit') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: definitionActivityMode.displayProperties.name,
          mode: definitionActivityModeParent.displayProperties.name,
          description: definitionActivityMode.displayProperties.description,
          destination: {
            name: definitionActivity.displayProperties.name,
            place: definitionActivity.displayProperties.description
          },
          className: 'gambit',
          activityLightLevel: false,
          icon: <span className='destiny-gambit' />
        };
      }

      if (modeFiltered === 'strike') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          mode: manifest.DestinyActivityTypeDefinition[2884569138].displayProperties.name,
          className: 'strike',
          icon: <span className='destiny-strike' />
        };
      }

      if (modeFiltered === 'nightfall-ordeal') {
        const strikeHash = Object.keys(enums.nightfalls).find(k => enums.nightfalls[k].ordealHashes.includes(definitionActivity.hash));
        const definitionStrke = manifest.DestinyActivityDefinition[strikeHash];

        activityTypeDisplay = {
          ...activityTypeDisplay,
          // name: definitionActivity.displayProperties.name,
          // mode: manifest.DestinyActivityTypeDefinition[2884569138].displayProperties.name,
          name: definitionStrke.selectionScreenDisplayProperties.name,
          mode: definitionActivity.displayProperties.name,
          description: definitionStrke.displayProperties.description,
          className: 'strike',
          icon: <span className='destiny-strike' />
        };
      }

      if (modeFiltered === 'adventure') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          mode: t('Adventure'),
          className: 'adventure',
          icon: (
            <span className='destiny-adventure2'>
              <span className='path1' />
              <span className='path2' />
              <span className='path3' />
              <span className='path4' />
              <span className='path5' />
              <span className='path6' />
            </span>
          )
        };
      }

      if (modeFiltered === 'nightmare-hunt') {
        console.log(definitionActivity);
        activityTypeDisplay = {
          ...activityTypeDisplay,
          name: definitionActivity.displayProperties.name,
          mode: manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash].displayProperties.name,
          description: definitionActivity.displayProperties.description,
          className: 'nightmare-hunt',
          icon: <span className='destiny-shadowkeep' />
        };
      }

      if (modeFiltered === 'vex-offensive') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          mode: manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash].displayProperties.name,
          className: 'vex-offensive',
          icon: (
            <span className='destiny-vex-invasion'>
              <span className='path1' />
              <span className='path2' />
              <span className='path3' />
            </span>
          )
        };
      }

      if (modeFiltered === 'dungeon') {
        activityTypeDisplay = {
          ...activityTypeDisplay,
          className: 'dungeon',
          icon: (
            <span className='destiny-dungeon'>
              <span className='path1' />
              <span className='path2' />
              <span className='path3' />
            </span>
          )
        };
      }

      const checklistEntry = lookup({ key: 'activityHash', value: hash });

      const checklist = checklistEntry.checklistId && checklists[checklistEntry.checklistId]({ requested: [checklistEntry.checklistHash] });
      const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', 'activity', activityTypeDisplay.className)}>
            <div className='header'>
              <div className='icon'>{activityTypeDisplay.icon}</div>
              <div className='text'>
                <div className='name'>{activityTypeDisplay.name}</div>
                <div>
                  <div className='kind'>{activityTypeDisplay.mode}</div>
                </div>
              </div>
            </div>
            <div className='black'>
              {activityTypeDisplay.pgcrImage && activityTypeDisplay.pgcrImage !== '/img/theme/destiny/bgs/pgcrs/placeholder.jpg' ? (
                <div className='screenshot'>
                  <ObservedImage className='image' src={`https://www.bungie.net${activityTypeDisplay.pgcrImage}`} />
                </div>
              ) : null}
              {activityTypeDisplay.destination || activityTypeDisplay.description ? (
                <div className='description'>
                  {activityTypeDisplay.destination && activityTypeDisplay.destination.name ? (
                    <div className='destination'>
                      {activityTypeDisplay.destination.name !== activityTypeDisplay.destination.place && !activityTypeDisplay.destination.name.includes(activityTypeDisplay.destination.place) && activityTypeDisplay.destination.place ? (
                        <>
                          {activityTypeDisplay.destination.name}, {activityTypeDisplay.destination.place}
                        </>
                      ) : (
                        activityTypeDisplay.destination.name
                      )}
                    </div>
                  ) : null}
                  <pre>{activityTypeDisplay.description}</pre>
                </div>
              ) : null}
              {definitionActivity.timeToComplete ? (
                <div className='time-to-complete'>
                  {t('Time to complete')}: {t('{{number}} minutes', { number: definitionActivity.timeToComplete || 0 })}
                </div>
              ) : null}
              {activityTypeDisplay.activityLightLevel ? (
                <div className='recommended-light'>
                  {t('Recommended Power')}: <span>{activityTypeDisplay.activityLightLevel}</span>
                </div>
              ) : null}
              {checklistItem && checklistItem.completed ? <div className='completed'>{t('Completed')}</div> : null}
            </div>
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Activity);
