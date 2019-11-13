import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import manifest from '../../../../utils/manifest';
import ObservedImage from '../../../../components/ObservedImage';
import Collectibles from '../../../../components/Collectibles';
import Items from '../../../../components/Items';
import Records from '../../../../components/Records';

import './styles.css';

class Raids extends React.Component {
  render() {
    const { t, member } = this.props;
    const milestones = member.data.milestones;
    const characterActivities = member.data.profile.characterActivities.data;

    const data = {
      gos: {
        name: manifest.DestinyActivityDefinition[2659723068].displayProperties.name,
        description: manifest.DestinyActivityDefinition[2659723068].displayProperties.description,
        challenge: characterActivities[member.characterId].availableActivities.find(a => a.activityHash === 2659723068) && characterActivities[member.characterId].availableActivities.find(a => a.activityHash === 2659723068).modifierHashes,
        collectibles: [1988948484],
        triumphs: [],
        challenges: {
          2095683347: {
            description: t("Complete the Consecrated Mind encounter without killing any Cyclops that spawn in the Harpy boss's presence. Cyclops that spawn in other areas, and during the final sprint, can be killed."),
            triumphs: [3281243931]
          },
          2472478405: {
            description: t('Unknown 1'),
            triumphs: [1661612473]
          },
          4080157289: {
            description: t('Unknown 2'),
            triumphs: [3167166053]
          },
          405180260: {
            description: t('All players must refresh their Enlightened buff at approximately the same time. However, the team may be split up at different tethers.'),
            triumphs: [1925300422]
          }
        }
      },
      cos: {
        name: manifest.DestinyCollectibleDefinition[193320249].displayProperties.name,
        description: manifest.DestinyActivityDefinition[960175301].displayProperties.description,
        challenge: manifest.DestinyVendorDefinition[3347378076].itemList
          .map(item => {
            if (manifest.DestinyVendorDefinition[3347378076].categories.find(c => c.categoryHash === 3151502845).vendorItemIndexes.includes(item.vendorItemIndex)) {
              return item.itemHash;
            } else {
              return false;
            }
          })
          .filter(t => manifest.statistics.bounties.hawthorne.includes(t)),
        collectibles: [2329697053],
        triumphs: [],
        challenges: {
          2459033425: {
            name: manifest.DestinyInventoryItemDefinition[2459033425].displayProperties.name,
            description: t("Ritual encounter: no more than two Guardians may have the Witch's Blessing buff at one time during The Hive Ritual."),
            triumphs: [1575460004]
          },
          2459033426: {
            name: manifest.DestinyInventoryItemDefinition[2459033426].displayProperties.name,
            description: t("Deception encounter: break the Deception's shield 5 times during phase in which he is defeated i.e. a single phase."),
            triumphs: [1575460003]
          },
          2459033427: {
            name: manifest.DestinyInventoryItemDefinition[2459033427].displayProperties.name,
            description: t("Gahlran encounter: each Guardian may only shoot one of _the real_ Gahlran's hands once during only one of his hand raises."),
            triumphs: [1575460002]
          }
        }
      },
      sotp: {
        name: manifest.DestinyActivityDefinition[548750096].displayProperties.name,
        description: manifest.DestinyActivityDefinition[548750096].displayProperties.description,
        challenge: manifest.DestinyVendorDefinition[3347378076].itemList
          .map(item => {
            if (manifest.DestinyVendorDefinition[3347378076].categories.find(c => c.categoryHash === 1750123300).vendorItemIndexes.includes(item.vendorItemIndex)) {
              return item.itemHash;
            } else {
              return false;
            }
          })
          .filter(t => manifest.statistics.bounties.hawthorne.includes(t)),
        collectibles: [2220014607],
        triumphs: [],
        challenges: {
          1381881897: {
            name: manifest.DestinyInventoryItemDefinition[1381881897].displayProperties.name,
            description: t('Insurrection Prime encounter: A Guardian may not shoot and break more than one shield generator per phase.'),
            triumphs: [4162926221]
          },
          1348944144: {
            name: manifest.DestinyInventoryItemDefinition[1348944144].displayProperties.name,
            description: t('Botza District encounter: the map generator must not fall below half charge.'),
            triumphs: [1804999028]
          },
          3415614992: {
            name: manifest.DestinyInventoryItemDefinition[3415614992].displayProperties.name,
            description: t('Vault Access encounter: Each Guardian must grab and deposit each Phase Radiance buff once (boss must be killed in 3 damage phases).'),
            triumphs: [1428463716]
          }
        }
      },
      lw: {
        name: manifest.DestinyPresentationNodeDefinition[1500485992].displayProperties.name,
        description: manifest.DestinyActivityDefinition[1661734046].displayProperties.description,
        challenge: manifest.DestinyVendorDefinition[3347378076].itemList
          .map(item => {
            if (manifest.DestinyVendorDefinition[3347378076].categories.find(c => c.categoryHash === 4097321267).vendorItemIndexes.includes(item.vendorItemIndex)) {
              return item.itemHash;
            } else {
              return false;
            }
          })
          .filter(t => manifest.statistics.bounties.hawthorne.includes(t)),
        collectibles: [199171385],
        triumphs: [],
        challenges: {
          1250327262: {
            name: manifest.DestinyInventoryItemDefinition[1250327262].displayProperties.name,
            description: t("Shuro Chi chase encounter: Guardians must not take damage from Shuro Chi's Arc Blast."),
            triumphs: [2196415799]
          },
          3871581136: {
            name: manifest.DestinyInventoryItemDefinition[3871581136].displayProperties.name,
            description: t("Morgeth encounter: don't kill smol ogres, only kill big boi."),
            triumphs: [1672792871]
          },
          1568895666: {
            name: manifest.DestinyInventoryItemDefinition[1568895666].displayProperties.name,
            description: t('Vault encounter: knights must be killed in the rooms they spawn in.'),
            triumphs: [149192209]
          },
          4007940282: {
            name: manifest.DestinyInventoryItemDefinition[4007940282].displayProperties.name,
            description: t('Riven encounter: Guardians must not shoot the same eye twice.'),
            triumphs: [3899933775]
          },
          2836954349: {
            name: manifest.DestinyInventoryItemDefinition[2836954349].displayProperties.name,
            description: t('Kalli encounter: Cleanse all nine plates, kill all nine Knights, and kill all Ogres before damaging Kalli.'),
            triumphs: [2822000740]
          }
        }
      },
      levi: {
        name: manifest.DestinyActivityDefinition[89727599].displayProperties.name,
        description: manifest.DestinyActivityDefinition[89727599].displayProperties.description,
        challenge: milestones[3660836525] && milestones[3660836525].activities && milestones[3660836525].activities.length && milestones[3660836525].activities[0].modifierHashes,
        phaseOrder: milestones[3660836525] && milestones[3660836525].activities && milestones[3660836525].activities.length && milestones[3660836525].activities[0].phaseHashes,
        phases: {
          3847906370: {
            name: t('The Pleasure Gardens'),
            description: t('Smell the roses, Guardian... Feed my hungry pets'),
            icon: manifest.DestinyActivityModifierDefinition[871205855].displayProperties.icon
          },
          2188993306: {
            name: t('The Royal Pools'),
            description: t('Bathe with my loyalists in their pools'),
            icon: manifest.DestinyActivityModifierDefinition[3296085675].displayProperties.icon
          },
          1431486395: {
            name: t('The Gauntlet'),
            description: t('Demonstrate your tenacity for the game, my champion'),
            icon: manifest.DestinyActivityModifierDefinition[2863316929].displayProperties.icon
          },
          4231923662: {
            name: t('The Throne'),
            description: t('COME– I must congratulate you in person! [maniacal laughter]'),
            icon: manifest.DestinyActivityModifierDefinition[2770077977].displayProperties.icon
          }
        },
        challenges: {
          871205855: {
            name: t('The Pleasure Gardens'),
            description: t('Relic holders may only shoot one plant per phase.')
          },
          3296085675: {
            name: t('The Royal Pools'),
            description: t('One Guardian must remain in the middle with their feet in the water during the entire encounter.')
          },
          2863316929: {
            name: t('The Gauntlet'),
            description: t('Guardians cannot stand on the same plate more than once.')
          },
          2770077977: {
            name: t('The Throne'),
            description: t('Burn all 4 plates at the same time for every damage phase. Do not fire before all plates are activated.')
          }
        },
        collectibles: [199171389],
        triumphs: []
      }
    };

    const leviathanStyle = key => {
      return {
        className: [],
        mods: [
          {
            className: [],
            component: (
              <React.Fragment key={key}>
                <div className='module-header'>
                  <div className='sub-name'>{t('Raid')}</div>
                  <div className='name'>{data[key].name}</div>
                </div>
                <h4>{t('Challenge')}</h4>
                <ul className='list modifiers'>
                  {data[key].challenge.map((p, i) => {
                    return (
                      <li key={i}>
                        <div className='icon'>
                          <ObservedImage className='image' src={`https://www.bungie.net${data[key].challenges[p].icon || (manifest.DestinyActivityModifierDefinition[p] && manifest.DestinyActivityModifierDefinition[p].displayProperties && manifest.DestinyActivityModifierDefinition[p].displayProperties.icon)}`} />
                        </div>
                        <div className='text'>
                          <div className='name'>{data[key].challenges[p].name || (manifest.DestinyActivityModifierDefinition[p] && manifest.DestinyActivityModifierDefinition[p].displayProperties && manifest.DestinyActivityModifierDefinition[p].displayProperties.name)}</div>
                          <div className='description'>
                            <p>{data[key].challenges[p].description}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {data[key].phases ? (
                  <>
                    <h4>{t('Rotation')}</h4>
                    <ul className='list modifiers'>
                      {data[key].phaseOrder.map((p, i) => {
                        return (
                          <li key={i}>
                            <div className='icon'>
                              <ObservedImage className='image' src={`https://www.bungie.net${data[key].phases[p].icon}`} />
                            </div>
                            <div className='text'>
                              <div className='name'>{data[key].phases[p].name}</div>
                              <div className='description'>{data[key].phases[p].description}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}
                <h4>{t('Collectibles')}</h4>
                <ul className='list collection-items'>
                  <Collectibles selfLinkFrom='/this-week' hashes={data[key].collectibles} />
                </ul>
                {(data[key].challenges[data[key].challenge[0]].triumphs || []).concat(data[key].triumphs).length ? (
                  <>
                    <h4>{t('Triumphs')}</h4>
                    <ul className='list record-items'>
                      <Records selfLinkFrom='/this-week' hashes={(data[key].challenges[data[key].challenge[0]] || []).triumphs.concat(data[key].triumphs)} ordered />
                    </ul>
                  </>
                ) : null}
              </React.Fragment>
            )
          }
        ]
      };
    };

    const bountyStyle = key => {
      return {
        className: [],
        mods: [
          {
            className: [],
            component: (
              <React.Fragment key={key}>
                <div className='module-header'>
                  <div className='sub-name'>{t('Raid')}</div>
                  <div className='name'>{data[key].name}</div>
                </div>
                <h4>{t('Challenge')}</h4>
                <div className='raid-challenge'>
                  <ul className='list inventory-items'>
                    <Items
                      items={data[key].challenge.map(c => {
                        return {
                          itemHash: c
                        };
                      })}
                    />
                  </ul>
                  <div className='text'>
                    <div className='name'>{data[key].challenges[data[key].challenge[0]].name}</div>
                    <ReactMarkdown className='description' source={data[key].challenges[data[key].challenge[0]].description} />
                  </div>
                </div>
                <h4>{t('Collectibles')}</h4>
                <ul className='list collection-items'>
                  <Collectibles selfLinkFrom='/this-week' hashes={data[key].collectibles} />
                </ul>
                <h4>{t('Triumphs')}</h4>
                <ul className='list record-items'>
                  <Records selfLinkFrom='/this-week' hashes={data[key].challenges[data[key].challenge[0]].triumphs.concat(data[key].triumphs)} ordered />
                </ul>
              </React.Fragment>
            )
          }
        ]
      };
    };

    return ['gos', 'cos', 'sotp', 'lw', 'levi']
      .map(r => {
        if (['gos', 'levi'].includes(r)) {
          return leviathanStyle(r);
        } else {
          return bountyStyle(r);
        }
      })
      .map((col, c) => {
        return (
          <div key={c} className={cx('column', ...col.className)}>
            {col.mods.map((mod, m) => {
              return (
                <div key={m} className={cx('module', ...mod.className)}>
                  {mod.component}
                </div>
              );
            })}
          </div>
        );
      });
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
)(Raids);
