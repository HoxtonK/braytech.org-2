import React from 'react';

import ObservedImage from '../../ObservedImage';

const ui = perk => {
  return (
    <div className='perk'>
      <ObservedImage className='image icon' src={`https://www.bungie.net${perk.displayProperties.icon}`} />
      <div className='text'>
        <div className='description'>{perk.displayProperties.description}</div>
      </div>
    </div>
  );
};

export default ui;
