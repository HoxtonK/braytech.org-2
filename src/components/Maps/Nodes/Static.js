import React from 'react';

import { Marker } from 'react-leaflet';

import manifest from '../../../utils/manifest';

import maps from '../../../data/lowlines/maps/destinations';

import * as marker from '../markers';

class Static extends React.Component {
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

  render() {
    const map = maps[this.props.id].map;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (map.width - viewWidth) / 2;
    const mapYOffset = -(map.height - viewHeight) / 2;

    return maps[this.props.id].map.bubbles.map(bubble =>
      bubble.nodes.map((node, i) => {
        const markerOffsetX = mapXOffset + viewWidth / 2;
        const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

        const offsetX = markerOffsetX + (node.x ? node.x : 0);
        const offsetY = markerOffsetY + (node.y ? node.y : 0);

        if (node.type === 'title') {
          const definitionDestination = maps[this.props.id].destination.hash && manifest.DestinyDestinationDefinition[maps[this.props.id].destination.hash];
          const definitionBubble = bubble.hash && definitionDestination && definitionDestination.bubbles && definitionDestination.bubbles.find(b => b.hash === bubble.hash);

          let name = bubble.name;
          if (definitionBubble && definitionBubble.displayProperties.name && definitionBubble.displayProperties.name !== '') {
            name = definitionBubble.displayProperties.name;
          }

          if (bubble.sub) {
            name = `<i class='segoe-uniE1761'></i> ${name}`
          }

          const icon = marker.text(['interaction-none', bubble.type], name);

          return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        } else if (node.type === 'vendor' && node.vendorHash !== 2190858386) {
          const icon = marker.icon({ hash: node.vendorHash, table: 'DestinyVendorDefinition' }, ['native'], { icon: 'destiny-faction_fella' });

          return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        } else if (node.type === 'fast-travel') {
          const icon = marker.iconFastTravel({}, ['interaction-none']);

          return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        } else if (node.type === 'forge') {
          const icon = marker.iconForge({ hash: node.activityHash, playlist: node.playlistHash, table: 'DestinyActivityDefinition' }, []);

          return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        } else {
          return null;
        }
      })
    );
  }
}

export default Static;
