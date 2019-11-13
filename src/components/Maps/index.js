import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import cx from 'classnames';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from 'react-leaflet';

import maps from '../../data/lowlines/maps/destinations';
import nodes from '../../data/lowlines/maps/nodes';

import manifest from '../../utils/manifest';
import * as ls from '../../utils/localStorage';
import { checklists, lookup } from '../../utils/checklists';
import CharacterEmblem from '../../components/UI/CharacterEmblem';
import Spinner from '../../components/UI/Spinner';

import * as utils from './utils';

import { Layers, BackgroundLayer } from './Layers';
import Static from './Nodes/Static';
import Checklists from './Nodes/Checklists';
import Runtime from './Nodes/Runtime';
import CharacterActivities from './Nodes/CharacterActivities';

import './styles.css';

class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      viewport: this.getInitialViewport(this.resolveDestination(this.props.params.map).id),
      ui: {
        destinations: false,
        characters: false
      }
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(pP, pS) {
    if (pP.params.map !== this.props.params.map && this.mounted) {
      this.setDestination(this.props.params.map);
    }
  }

  resolveDestination = (map = false) => {
    const destinationById = map && utils.destinations.find(d => d.id === map);
    const destinationByHash = map && utils.destinations.find(d => d.destinationHash === parseInt(map, 10));

    if (destinationById) {
      return destinationById;
    } else if (destinationByHash) {
      return destinationByHash;
    } else {
      return utils.destinations.find(d => d.default);
    }
  };

  getMapCenter = id => {
    if (!maps[id]) return [0, 0];

    const map = maps[id].map;

    const centerYOffset = -(map.center && map.center.y) || 0;
    const centerXOffset = (map.center && map.center.x) || 0;

    const center = [map.height / 2 + centerYOffset, map.width / 2 + centerXOffset];

    return center;
  };

  getInitialViewport = id => {
    let center = this.getMapCenter(id);
    let zoom = 0;

    if (this.props.params.highlight) {
      const map = maps[id].map;
      const hash = parseInt(this.props.params.highlight, 10);

      const checklistLookup = lookup({ key: 'checklistHash', value: hash });
      const recordLookup = lookup({ key: 'recordHash', value: hash });

      const entry = (checklistLookup && checklistLookup.checklistId && checklistLookup) || (recordLookup && recordLookup.checklistId && recordLookup);

      const checklist = entry && entry.checklistId && checklists[entry.checklistId]({ requested: entry.recordHash ? { key: 'recordHash', array: [entry.recordHash] } : { key: 'checklistHash', array: [entry.checklistHash] } });
      const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

      if (checklistItem && checklistItem.points && checklistItem.points.length && checklistItem.points[0]) {
        const markerY = checklistItem.points[0].y || 0;
        const markerX = checklistItem.points[0].x || 0;

        center = [map.height / 2 + markerY, map.width / 2 + markerX];
      }
    }

    if (this.props.viewport.width <= 600) {
      zoom = -1;
    }

    return {
      center,
      zoom
    }
  };

  setDestination = destination => {
    const resolved = this.resolveDestination(destination);

    this.setState(p => ({
      viewport: {
        ...p.viewport,
        center: this.getMapCenter(resolved.id)
      }
    }));
  };

  handler_map_viewportChanged = viewport => {
    if (typeof viewport.zoom === 'number' && viewport.center && viewport.center.length === 2) this.setState({ viewport });
  };

  handler_zoomIncrease = e => {
    this.setState(p => ({
      viewport: {
        ...p.viewport,
        zoom: p.viewport.zoom + 1
      }
    }));
  };

  handler_zoomDecrease = e => {
    this.setState(p => ({
      viewport: {
        ...p.viewport,
        zoom: p.viewport.zoom - 1
      }
    }));
  };

  handler_toggleDestinationsList = e => {
    const href = e.target.href;
    const id = this.resolveDestination(this.props.params.map).id;

    if (href.includes(id)) {
      this.setState(p => {
        if (p.ui.destinations) {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: false
            }
          };
        } else {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: true
            }
          };
        }
      });
    } else {
      this.setState(p => {
        return {
          ...p,
          ui: {
            ...p.ui,
            destinations: false
          }
        };
      });
    }
  };

  handler_changeCharacterId = e => {
    const characterId = e.currentTarget.dataset.characterid;

    const { member } = this.props;

    if (member.characterId === characterId) {
      this.setState(p => {
        if (p.ui.characters) {
          return {
            ...p,
            ui: {
              ...p.ui,
              characters: false
            }
          };
        } else {
          return {
            ...p,
            ui: {
              ...p.ui,
              characters: true
            }
          };
        }
      });
    } else {
      this.setState(p => {
        return {
          ...p,
          ui: {
            ...p.ui,
            characters: false
          }
        };
      });
      this.props.changeCharacterId({ membershipType: member.membershipType, membershipId: member.membershipId, characterId });
      ls.set('setting.profile', { membershipType: member.membershipType, membershipId: member.membershipId, characterId });
    }
  };

  handler_map_layersReady = () => {
    this.setState({ loading: false });
  };

  handler_map_layerAdd = debounce(e => {
    if (this.mounted) this.props.rebindTooltips();
  }, 200);

  handler_map_moveEnd = e => {
    if (this.mounted) this.props.rebindTooltips();
  };

  handler_map_zoomEnd = e => {
    if (this.mounted) this.props.rebindTooltips();
  };

  handler_map_mouseDown = e => {
    if (!this.props.settings.debug || !this.props.settings.logDetails) return;

    const destination = this.resolveDestination(this.props.params.map).id;

    const map = maps[destination].map;

    let originalX, originalY;

    let offsetX = e.latlng.lng;
    let offsetY = e.latlng.lat;

    let midpointX = map.width / 2;
    let midpointY = map.height / 2;

    if (offsetX > midpointX) {
      originalX = -(midpointX - offsetX);
    } else {
      originalX = offsetX - midpointX;
    }

    if (offsetY > midpointY) {
      originalY = -(midpointY - offsetY);
    } else {
      originalY = offsetY - midpointY;
    }

    console.log(JSON.stringify({ map: { x: originalX, y: originalY } }));
    console.log(JSON.stringify({ x: originalX, y: originalY }));
  };

  handler_map_viewportChange = e => {
    if (!this.props.settings.debug || !this.props.settings.logDetails) return;

    console.log(e);
  };

  render() {
    const { member, viewport, settings, params } = this.props;

    const destination = this.resolveDestination(params.map);
    const map = maps[destination.id].map;
    const bounds = [[0, 0], [map.height, map.width]];

    return (
      <div className={cx('map-omega', `zoom-${this.state.viewport.zoom}`, { loading: this.state.loading, debug: settings.debug, 'highlight-no-screenshot': settings.noScreenshotHighlight })}>
        <div className='leaflet-pane leaflet-background-pane tinted'>
          <BackgroundLayer {...destination} />
        </div>
        <Map
          viewport={this.state.viewport}
          minZoom='-2'
          maxZoom='2'
          maxBounds={bounds}
          crs={L.CRS.Simple}
          attributionControl={false}
          zoomControl={false}
          zoomAnimation={false}
          onViewportChange={this.handler_map_viewportChange}
          onViewportChanged={this.handler_map_viewportChanged}
          onLayerAdd={this.handler_map_layerAdd}
          onMove={this.handler_map_move}
          onMoveEnd={this.handler_map_moveEnd}
          onZoomEnd={this.handler_map_zoomEnd}
          onMouseDown={this.handler_map_mouseDown}
        >
          <Layers {...destination} ready={this.handler_map_layersReady} />
          <Static {...destination} />
          <Checklists {...destination} highlight={params.highlight} />
          <Runtime {...destination} />
          {/* <CharacterActivities {...destination} /> */}
        </Map>
        <div className='loading'>
          <Spinner />
        </div>
        <div className='controls left'>
          <div className={cx('control', 'characters', { visible: this.state.ui.characters })}>
            <ul className='list'>
              {member && member.data ? (
                <>
                  {member.data.profile.profile.data.characterIds.map(characterId => {
                    return (
                      <li key={characterId} className={cx('linked', { active: characterId === member.characterId })} data-characterid={characterId} onClick={this.handler_changeCharacterId}>
                        <CharacterEmblem characterId={characterId} />
                      </li>
                    );
                  })}
                  <li className='linked'>
                    <CharacterEmblem characterSelect />
                  </li>
                </>
              ) : (
                <li className='linked active'>
                  <CharacterEmblem onboarding />
                </li>
              )}
            </ul>
          </div>
          <div className={cx('control', 'destinations', { visible: this.state.ui.destinations })}>
            <ul className='list'>
              {utils.destinations.map(d => {
                let name = maps[d.id].destination.hash && manifest.DestinyDestinationDefinition[maps[d.id].destination.hash] && manifest.DestinyDestinationDefinition[maps[d.id].destination.hash].displayProperties.name;
                if (maps[d.id].destination.activityHash) {
                  name = manifest.DestinyActivityDefinition[maps[d.id].destination.activityHash].displayProperties.name;
                }

                return (
                  <li key={maps[d.id].destination.id} className={cx('linked', { active: maps[d.id].destination.id === destination.id })}>
                    <div className='text'>
                      <div className='name'>{name}</div>
                    </div>
                    <Link to={`/maps/${maps[d.id].destination.id}`} onClick={this.handler_toggleDestinationsList}></Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {viewport.width > 600 ? (
          <div className='control zoom visible'>
            <ul className='list'>
              <li className={cx('linked', { disabled: this.state.zoom === 2 })} onClick={this.handler_zoomIncrease}>
                <div className='text'>
                  <i className='segoe-uniE1091' />
                </div>
              </li>
              <li className={cx('linked', { disabled: this.state.zoom === -2 })} onClick={this.handler_zoomDecrease}>
                <div className='text'>
                  <i className='segoe-uniE1081' />
                </div>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    );
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
    },
    changeCharacterId: value => {
      dispatch({ type: 'MEMBER_CHARACTER_SELECT', payload: value });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Maps);
