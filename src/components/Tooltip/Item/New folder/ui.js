import React from 'react';

const ui = item => {
  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  let quanityMax = item.inventory && item.inventory.maxStackSize === parseInt(item.quantity, 10);

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {quanityMax && item.inventory.maxStackSize > 1 ? (
        <div className='quantity'>Quantity: <span>{item.inventory.maxStackSize}</span> (MAX)</div>
      ) : null}
    </>
  );
};

export default ui;
