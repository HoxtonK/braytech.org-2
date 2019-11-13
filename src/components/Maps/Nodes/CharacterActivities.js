import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Marker } from 'react-leaflet';

import manifest from '../../../utils/manifest';
import maps from '../../../data/lowlines/maps/destinations';

import * as marker from '../markers';

class CharacterActivities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(pP, pS) {
    
  }

  render() {
    const { member } = this.props;
    const characterActivities = member && member.data && member.data.profile.characterActivities.data;

    characterActivities && console.log(characterActivities[member.characterId].availableActivities.map(a => {
      if (!a.activityHash) return false;
      const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

      return {
        name: definitionActivity.displayProperties.name,
        ...a,
        definitionActivity
      }
    }));

    const map = maps[this.props.id].map;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (map.width - viewWidth) / 2;
    const mapYOffset = -(map.height - viewHeight) / 2;

    return null;

    return (
      (this.runtimeNodes &&
        this.runtimeNodes[this.props.id].map((node, i) => {
          return node.location.points.map(point => {
            const markerOffsetX = mapXOffset + viewWidth / 2;
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

            if (!point.x || !point.y) {
              console.warn(node);

              return null;
            }

            const offsetX = markerOffsetX + point.x;
            const offsetY = markerOffsetY + point.y;

            if (node.type.hash === 'patrol-boss') {
              if (node.availability && node.availability.now !== undefined && !node.availability.now) return null;

              const icon = marker.icon({ hash: node.hash, table: 'BraytechMapsDefinition' }, ['patrol-boss', node.screenshot ? `has-screenshot` : ''], { icon: node.icon || 'destiny-patrol-boss' });

              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
            } else {
              return null;
            }
          });
        })) ||
      null
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(connect(mapStateToProps))(CharacterActivities);
