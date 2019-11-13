import React from 'react';
import cx from 'classnames';

import { ImageOverlay } from 'react-leaflet';

import maps from '../../../data/lowlines/maps/destinations';

import * as utils from '../utils';

import './styles.css';

class Layers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      destinations: utils.destinations.map(d => ({ ...d, loading: true, error: false, layers: [] }))
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.prepareLayers(this.props.id);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(pP, pS) {
    if (pS.loading && !this.state.loading) {
      this.props.ready();
    }
  }

  loadLayers = async target => {
    try {
      const layers = await Promise.all(
        maps[target.id].map.layers
          .filter(layer => layer.type !== 'background')
          .map(async layer => {
            if (layer.nodes) {
              await Promise.all(
                layer.nodes.map(async layer => {
                  return await fetch(layer.image)
                    .then(r => {
                      return r.blob();
                    })
                    .then(blob => {
                      const objectURL = URL.createObjectURL(blob);

                      layer.image = objectURL;
                      return layer;
                    })
                    .catch(e => {
                      console.log(e);
                    });
                })
              );

              return layer;
            } else {
              return await fetch(layer.image)
                .then(r => {
                  return r.blob();
                })
                .then(blob => {
                  const objectURL = URL.createObjectURL(blob);

                  layer.image = objectURL;
                  return layer;
                })
                .catch(e => {
                  console.log(e);
                });
            }
          })
      );

      if (this.mounted) {
        this.setState(p => ({
          destinations: p.destinations.map(d => {
            if (d.destinationHash === target.destinationHash) {
              return {
                ...d,
                loading: false,
                error: false,
                layers
              };
            } else {
              return d;
            }
          })
        }));
      }
    } catch (e) {
      console.log(e);

      if (this.mounted) {
        this.setState(p => ({
          destinations: p.destinations.map(d => {
            if (d.destinationHash === target.destinationHash) {
              return {
                ...d,
                loading: false,
                error: true
              };
            } else {
              return d;
            }
          })
        }));
      }
    }
  };

  prepareLayers = async destination => {
    try {
      // await this.loadLayers(this.props.id);

      // if (this.mounted) {
      //   this.setState({ loading: false });
      //   this.props.softReady();
      // };

      await Promise.all(
        this.state.destinations
          .filter(d => d.loading)
          .map(async d => {
            await this.loadLayers(d);
          })
      );

      if (this.mounted) {
        this.setState({ loading: false });
        // this.props.ready();
      }

      console.log('done');
    } catch (e) {
      console.log(e);

      if (this.mounted) this.setState({ loading: false, error: true });
    }
  };

  render() {
    if (this.state.loading || this.state.error) {
      return null;
    } else {
      const map = maps[this.props.id].map;

      const viewWidth = 1920;
      const viewHeight = 1080;

      const mapXOffset = (map.width - viewWidth) / 2;
      const mapYOffset = -(map.height - viewHeight) / 2;

      const destination = this.state.destinations.find(d => d.destinationHash === this.props.destinationHash);

      return destination.layers
        .filter(layer => layer.type === 'map')
        .map(layer => {
          const layerX = layer.x ? layer.x : 0;
          const layerY = layer.y ? -layer.y : 0;

          const layerWidth = layer.width * 1;
          const layerHeight = layer.height * 1;

          let offsetX = (map.width - layerWidth) / 2;
          let offsetY = (map.height - layerHeight) / 2;

          offsetX += -offsetX + layerX + mapXOffset;
          offsetY += offsetY + layerY + mapYOffset;

          const bounds = [[offsetY, offsetX], [layerHeight + offsetY, layerWidth + offsetX]];

          if (layer.nodes) {
            return layer.nodes.map(node => {
              const nodeX = node.x ? node.x : 0;
              const nodeY = node.y ? node.y : 0;

              const nodeWidth = node.width * 1;
              const nodeHeight = node.height * 1;

              const nodeOffsetY = offsetY + (layerHeight - nodeHeight) / 2 + nodeY;
              const nodeOffsetX = offsetX + (layerWidth - nodeWidth) / 2 + nodeX;

              const bounds = [[nodeOffsetY, nodeOffsetX], [nodeHeight + nodeOffsetY, nodeWidth + nodeOffsetX]];

              return <ImageOverlay key={node.id} url={node.image} bounds={bounds} opacity={node.opacity || 1} />;
            });
          } else {
            return <ImageOverlay key={layer.id} url={layer.image} bounds={bounds} opacity={layer.opacity || 1} />;
          }
        });
    }
  }
}

class BackgroundLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      layers: [
        {
          id: 'background-upper',
          blob: false
        },
        {
          id: 'background-lower',
          blob: false
        }
      ]
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.init();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(pP, pS) {
    if (pP.id !== this.props.id) {
      this.init();
    }
  }

  load = async layers => {
    try {
      const loaded = await Promise.all(
        layers.map(async layer => {
          return await fetch(layer.image)
            .then(r => {
              return r.blob();
            })
            .then(blob => {
              const objectURL = URL.createObjectURL(blob);

              layer.blob = objectURL;

              return {
                ...layer
              };
            })
            .catch(e => {
              console.log(e);
            });
        })
      );

      return loaded;
    } catch (e) {
      console.log(e);
    }
  };

  tint = async layers => {
    try {
      const tinted = await Promise.all(
        layers.map(async layer => {
          if (layer.color) {
            const image = document.createElement('img');
            image.src = layer.blob;

            await new Promise(resolve => {
              image.onload = e => resolve();
            });

            const canvas = document.createElement('canvas');
            canvas.width = layer.width;
            canvas.height = layer.height;
            const context = canvas.getContext('2d');

            context.fillStyle = layer.color;
            context.fillRect(0, 0, layer.width, layer.height);

            context.globalCompositeOperation = 'destination-atop';
            context.drawImage(image, 0, 0, layer.width, layer.height);

            layer.tinted = canvas.toDataURL();

            return layer;
          } else {
            return layer;
          }
        })
      );

      return tinted;
    } catch (e) {
      console.log(e);
    }
  };

  init = async () => {
    try {
      this.setState({ loading: true, error: false });

      const layers = this.state.layers.map(layer => ({
        ...layer,
        ...maps[this.props.id].map.layers.find(l => l.id === layer.id)
      }));

      const blobs = (layers.filter(l => l.blob).length < 2 && (await this.load(layers))) || layers;
      const tinted = blobs && (await this.tint(blobs));

      if (this.mounted) {
        this.setState(p => ({
          ...p,
          loading: false,
          error: false,
          layers: tinted
        }));
      }

      console.log('background layers composited');
    } catch (e) {
      console.log(e);

      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const map = maps[this.props.id].map;

    if (this.state.loading || this.state.error) {
      return map.layers
        .filter(layer => layer.type === 'background')
        .map(l => {
          return <img key={`${this.props.id}_${l.id}`} alt={l.id} className={cx('layer-background', `layer-${l.id}`, { 'interaction-none': true })} />;
        });
    } else {
      return map.layers
        .filter(layer => layer.type === 'background')
        .map(l => {
          const layer = this.state.layers.find(layer => layer.id === l.id);

          return <img key={`${this.props.id}_${l.id}`} alt={l.id} src={layer.tinted} className={cx('layer-background', `layer-${l.id}`, 'dl', { 'interaction-none': true })} />;
        });
    }
  }
}

export { Layers, BackgroundLayer };

export default Layers;
