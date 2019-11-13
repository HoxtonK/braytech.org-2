import React from 'react';

import manifest from '../../../utils/manifest';

const Default = (props) => {
  const { hash, table, instanceId, itemComponents, quantity, state, rarity, type } = props;

  const definition = manifest[table][hash];

  // description
  const description = definition.displayProperties && definition.displayProperties.description !== '' && definition.displayProperties.description;

  

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
    </>
  );
};

export default Default;
