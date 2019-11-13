import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { Marker } from 'react-leaflet';

import checklists from '../../../utils/checklists';
import maps from '../../../data/lowlines/maps/destinations';
import nodes from '../../../data/lowlines/maps/nodes';

import * as marker from '../markers';

class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checklists: {
        1697465175: {
          // region chests
          visible: true
        },
        3142056444: {
          // lost sectors
          visible: true
        },
        4178338182: {
          // adventures
          visible: true
        },
        2360931290: {
          // ghost scans
          visible: true
        },
        365218222: {
          // sleeper nodes
          visible: true
        },
        2955980198: {
          // latent memories
          visible: true
        },
        1297424116: {
          // ahamkara bones
          visible: true
        },
        2609997025: {
          // corrupted eggs
          visible: true
        },
        2726513366: {
          // cat statues
          visible: true
        },
        1912364094: {
          // jade rabbits
          visible: true
        },
        1420597821: {
          // lore: ghost stories
          visible: true
        },
        3305936921: {
          // lore: awoken of the reef
          visible: true
        },
        655926402: {
          // lore: forsaken prince
          visible: true
        },
        4285512244: {
          // lore: lunas lost
          visible: true
        },
        2474271317: {
          // lore: inquisition of the damned
          visible: true
        }
      }
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.generateChecklists(this.id);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(pP, pS) {
    const { member } = this.props;

    if ((pP.member.data.updated !== member.data.updated || pP.member.characterId !== member.characterId) && this.mounted) {
      this.generateChecklists(this.state.id);
    }

    if (pS.checklists !== this.state.checklists && this.mounted) {
      this.props.rebindTooltips();
    }
  }

  generateChecklists = destination => {
    const lists = {
      1697465175: {
        // region chests
        ...checklists[1697465175]()
      },
      3142056444: {
        // lost sectors
        ...checklists[3142056444]()
      },
      4178338182: {
        // adventures
        ...checklists[4178338182]()
      },
      2360931290: {
        // ghost scans
        ...checklists[2360931290]()
      },
      365218222: {
        // sleeper nodes
        ...checklists[365218222]()
      },
      2955980198: {
        // latent memories
        ...checklists[2955980198]()
      },
      1297424116: {
        // ahamkara bones
        ...checklists[1297424116]()
      },
      2609997025: {
        // corrupted eggs
        ...checklists[2609997025]()
      },
      2726513366: {
        // cat statues
        ...checklists[2726513366]()
      },
      1912364094: {
        // jade rabbits
        ...checklists[1912364094]()
      },
      1420597821: {
        // lore: ghost stories
        ...checklists[1420597821]()
      },
      3305936921: {
        // lore: awoken of the reef
        ...checklists[3305936921]()
      },
      655926402: {
        // lore: forsaken prince
        ...checklists[655926402]()
      },
      4285512244: {
        // lore: lunas lost
        ...checklists[4285512244]()
      },
      2474271317: {
        // lore: inquisition of the damned
        ...checklists[2474271317]()
      }
    };

    Object.keys(lists).forEach(key => {
      const list = lists[key];

      const adjusted = {
        ...list,
        visible: this.state.checklists[key].visible,
        tooltipTable: 'DestinyChecklistDefinition',
        items: list.items.map(i => {
          const node = nodes.find(n => n.checklistHash === i.checklistHash);

          return {
            ...i,
            tooltipHash: i.checklistHash,
            screenshot: node && node.screenshot && true
          };
        })
      };

      if (list.checklistId === 4178338182) {
        adjusted.checklistIcon = 'destiny-adventure2';
        adjusted.tooltipTable = 'DestinyActivityDefinition';
        adjusted.items = adjusted.items.map(i => {
          return {
            ...i,
            tooltipHash: i.activityHash
          };
        });
      }

      // record-based nodes
      if ([1420597821, 3305936921, 655926402, 4285512244, 2474271317].includes(list.checklistId)) {
        adjusted.tooltipTable = 'DestinyRecordDefinition';
        adjusted.items = adjusted.items.map(i => {
          const node = nodes.find(n => n.recordHash === i.recordHash);

          return {
            ...i,
            tooltipHash: i.recordHash,
            screenshot: node && node.screenshot && true
          };
        });
      }

      lists[key] = adjusted;
    });

    // console.log(lists);

    this.setState({
      checklists: lists
    });
  };

  handler_markerMouseOver = e => {
    if (!this.props.settings.debug || !this.props.settings.logDetails) return;

    let dataset = {};
    try {
      dataset = e.target._icon.children[0].children[0].dataset;
    } catch (e) {}

    const node = dataset.hash && nodes.find(n => (dataset.table === 'DestinyChecklistDefinition' && n.checklistHash && n.checklistHash === parseInt(dataset.hash, 10)) || (dataset.table === 'DestinyRecordDefinition' && n.recordHash && n.recordHash === parseInt(dataset.hash, 10)) || (dataset.table === 'DestinyActivityDefinition' && n.activityHash && n.activityHash === parseInt(dataset.hash, 10)));

    console.log(node);

    const item = node && this.state.checklists[node.checklistId].items.find(i => (i.checklistHash && node.checklistHash && i.checklistHash === node.checklistHash) || (i.recordHash && node.recordHash && i.recordHash === node.recordHash));

    console.log(item);
  };

  render() {
    const { settings, highlight } = this.props;

    const map = maps[this.props.id].map;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapYOffset = -(map.height - viewHeight) / 2;
    const mapXOffset = (map.width - viewWidth) / 2;

    return Object.keys(this.state.checklists).map((key, k) => {
      const checklist = this.state.checklists[key];

      if (!checklist.visible || !checklist.items) return null;

      return checklist.items
        .filter(i => i.destinationHash === maps[this.props.id].destination.hash)
        .map((node, i) => {
          if (node.points.length) {
            return node.points.map(point => {
              const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;
              const markerOffsetX = mapXOffset + viewWidth / 2;

              if (!point.x || !point.y) {
                console.warn(node);

                return null;
              }

              const offsetY = markerOffsetY + point.y;
              const offsetX = markerOffsetX + point.x;

              // const text = checklist.checklistId === 3142056444 ? node.formatted.name : false;

              const icon = marker.icon({ hash: node.tooltipHash, table: checklist.tooltipTable }, [node.completed ? 'completed' : '', `checklistId-${checklist.checklistId}`, node.screenshot ? `has-screenshot` : '', highlight && parseInt(highlight, 10) === (node.checklistHash || node.recordHash) ? 'highlight' : ''], { icon: checklist.checklistIcon, url: checklist.checklistImage });
              // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

              const handler_markerMouseOver = (settings.debug && this.handler_markerMouseOver) || null;

              return <Marker key={`${node.checklistHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={handler_markerMouseOver} />;
            });
          } else if (this.props.settings.debug) {
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;
            const markerOffsetX = mapXOffset + viewWidth / 2;

            const offsetY = markerOffsetY + (k + 1) * 30 - 1250;
            const offsetX = markerOffsetX + (i + 1) * 50 - 0;

            // const text = checklist.checklistId === 3142056444 ? node.formatted.name : false;

            const icon = marker.icon({ hash: node.tooltipHash, table: checklist.tooltipTable }, [node.completed ? 'completed' : '', `checklistId-${checklist.checklistId}`, node.screenshot ? `has-screenshot` : ''], { icon: checklist.checklistIcon, url: checklist.checklistImage });
            // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

            const handler_markerMouseOver = (settings.debug && this.handler_markerMouseOver) || null;
            return <Marker key={`${node.checklistHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={handler_markerMouseOver} />;
          } else {
            return null;
          }
        });
    });
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
    viewport: state.viewport,
    settings: state.maps
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Checklists);
