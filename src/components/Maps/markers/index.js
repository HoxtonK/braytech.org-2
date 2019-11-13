import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

import './styles.css';

function generateIcon(destinyIcon) {
  let icon;

  if (destinyIcon === 'destiny-adventure2') {
    icon = (
      <div className='icon'>
        <span className='destiny-adventure2'>
          <span className='path1' />
          <span className='path2' />
          <span className='path3' />
          <span className='path4' />
          <span className='path5' />
          <span className='path6' />
        </span>
      </div>
    );
  } else if (destinyIcon === 'destiny-faction_fella') {
    icon = (
      <div className='icon'>
        <span className='destiny-faction_fella'>
          <span className='path1' />
          <span className='path2' />
          <span className='path3' />
          <span className='path4' />
          <span className='path5' />
        </span>
      </div>
    );
  } else if (destinyIcon === 'destiny-lore_scholar') {
    icon = (
      <div className='icon'>
        <span className='destiny-lore_scholar'>
          <span className='path1' />
          <span className='path2' />
          <span className='path3' />
          <span className='path4' />
          <span className='path5' />
          <span className='path6' />
        </span>
      </div>
    );
  } else {
    icon = <div className={`icon ${destinyIcon}`} />;
  }

  return icon;
}

export const icon = (tooltip = {}, classNames = [], marker = {}, text) => {
  const icon = marker.icon && generateIcon(marker.icon);
  const html = (
    <div className='wrapper'>
      {tooltip.hash ? (
        <>
          <div className='tooltip' data-hash={tooltip.hash} data-table={tooltip.table}>
            {icon ? icon : <div className='icon' />}
          </div>
          {text ? <div className='text'>${text}</div> : null}
        </>
      ) : (
        <>
          {icon ? icon : <div className='icon' />}
          {text ? <div className='text'>${text}</div> : null}
        </>
      )}
    </div>
  );

  return L.divIcon({
    className: ['icon-marker'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(html)
  });
};

export const text = (classNames = [], name) => {
  return L.divIcon({
    className: ['text-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='name'>${name}</div></div>`
  });
};

export const iconFastTravel = (tooltip = {}, classNames = []) => {
  const html = (
    <div className='wrapper'>
      <div className='fast-travel'>
        <div className='shadow' />
        <div className='star' />
        <div className='outline' />
        <div className='square'>
          <div className='sq tl' />
          <div className='sq tr' />
          <div className='sq bl' />
          <div className='sq br' />
        </div>
        <div className='triangles' />
      </div>
    </div>
  );

  return L.divIcon({
    className: ['icon-marker', 'native'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(html)
  });
};

export const iconForge = (tooltip = {}, classNames = []) => {
  const html = (
    <div className='wrapper'>
      <div className='forge tooltip' data-hash={tooltip.hash} data-playlist={tooltip.playlist} data-table={tooltip.table}>
        <div className='dial' />
        <div className='frame' />
        <div className='logo' />
      </div>
    </div>
  );

  return L.divIcon({
    className: ['icon-marker', 'native'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(html)
  });
};

export const iconPatrolBoss = (tooltip = {}, classNames = []) => {
  const html = (
    <div className='wrapper'>
      <div className='icon tooltip' data-hash={tooltip.hash} data-table={tooltip.table}>
        <div className='patrol-boss'>
          <span className='destiny-raid' />
        </div>
      </div>
    </div>
  );

  return L.divIcon({
    className: ['icon-marker', 'native'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(html)
  });
};
