import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

export class EmblemIcon extends React.Component {
  render() {
    const { hash } = this.props;

    const definitionEmblem = manifest.DestinyInventoryItemDefinition[hash];

    return (
      <ObservedImage
        className={cx('image', 'secondaryOverlay', {
          missing: definitionEmblem.redacted
        })}
        src={`https://www.bungie.net${!definitionEmblem.redacted ? definitionEmblem.secondaryOverlay : `/img/misc/missing_icon_d2.png`}`}
      />
    );
  }
}

export class EmblemBackground extends React.Component {
  render() {
    const { hash } = this.props;

    const definitionEmblem = manifest.DestinyInventoryItemDefinition[hash];

    const veryLightEmblems = [4182480236, 3961503937];

    return (
      <ObservedImage
        className={cx('image', 'emblem', {
          missing: definitionEmblem.redacted,
          'very-light': veryLightEmblems.includes(definitionEmblem.hash)
        })}
        src={`https://www.bungie.net${definitionEmblem.secondarySpecial ? definitionEmblem.secondarySpecial : `/img/misc/missing_icon_d2.png`}`}
      />
    );
  }
}
