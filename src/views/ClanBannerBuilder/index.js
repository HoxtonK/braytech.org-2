import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import assign from 'lodash/assign';
import cx from 'classnames';
import mapValues from 'lodash/mapValues';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import Spinner from '../../components/UI/Spinner';
import ClanBanner from '../../components/UI/ClanBanner';

import './styles.css';

class ClanBannerBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clanBannerManifest: true
    };

    this.clanBannerDefault = {
      decalBackgroundColorId: 3568748755,
      decalColorId: 3379387794,
      decalId: 4125445800,
      gonfalonColorId: 2174413913,
      gonfalonDetailColorId: 4112122941,
      gonfalonDetailId: 1681253713,
      gonfalonId: 1473910866
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {}

  render() {
    const { t } = this.props;
    let bannerData = this.props.match.params.decalId
      ? mapValues(this.props.match.params, value => {
          return parseInt(value, 10);
        })
      : this.clanBannerDefault;

    const buildLink = object => {
      let potentialData = assign({}, bannerData, object);
      return `/clan-banner-builder/${Object.values(potentialData).join('/')}/`;
    };

    let configOptions = [];
    if (manifest.DestinyClanBannerDefinition) {
      let clanBannerManifest = manifest.DestinyClanBannerDefinition;

      let decals = [];

      clanBannerManifest.Decals.forEach(decal => {
        let link = buildLink({ decalId: decal.imageHash });
        decals.push(
          <div
            key={decal.imageHash}
            className={cx('option', 'decal', {
              active: bannerData.decalId === decal.imageHash
            })}
          >
            <ObservedImage className='image' src={`https://www.bungie.net${decal.backgroundImagePath}`} />
            <ObservedImage className='image' src={`https://www.bungie.net${decal.foregroundImagePath}`} />
            <Link to={link} />
          </div>
        );
      });

      configOptions.push(
        <React.Fragment key='decals'>
          <h3>{t('Banner Emblem')}</h3>
          <div className='optionSet decals'>{decals}</div>
        </React.Fragment>
      );

      let decalPrimaryColors = [];

      clanBannerManifest.DecalPrimaryColors.forEach(color => {
        let link = buildLink({ decalColorId: color.colorHash });
        decalPrimaryColors.push({
          sortValue: color.colorHash,
          element: (
            <div
              key={color.colorHash}
              className={cx('option', 'color', {
                active: bannerData.decalColorId === color.colorHash
              })}
            >
              <div className='box' style={{ backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, ${Math.min(color.alpha, 1)})` }} />
              <Link to={link} />
            </div>
          )
        });
      });

      decalPrimaryColors.sort((b, a) => a.sortValue - b.sortValue);

      configOptions.push(
        <React.Fragment key='decalPrimaryColors'>
          <h3>{t('Emblem Foreground Color')}</h3>
          <div className='optionSet colors decalPrimaryColors'>{decalPrimaryColors.map(object => object.element)}</div>
        </React.Fragment>
      );

      let decalSecondaryColors = [];

      clanBannerManifest.DecalSecondaryColors.forEach(color => {
        let link = buildLink({ decalBackgroundColorId: color.colorHash });
        decalSecondaryColors.push({
          sortValue: color.colorHash,
          element: (
            <div
              key={color.colorHash}
              className={cx('option', 'color', {
                active: bannerData.decalBackgroundColorId === color.colorHash
              })}
            >
              <div className='box' style={{ backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, ${Math.min(color.alpha, 1)})` }} />
              <Link to={link} />
            </div>
          )
        });
      });

      decalSecondaryColors.sort((b, a) => a.sortValue - b.sortValue);

      configOptions.push(
        <React.Fragment key='decalSecondaryColors'>
          <h3>{t('Emblem Background Color')}</h3>
          <div className='optionSet colors decalSecondaryColors'>{decalSecondaryColors.map(object => object.element)}</div>
        </React.Fragment>
      );

      let gonfalonDetails = [];

      clanBannerManifest.GonfalonDetails.forEach(detail => {
        let link = buildLink({ gonfalonDetailId: detail.imageHash });
        gonfalonDetails.push(
          <div
            key={detail.imageHash}
            className={cx('option', 'decal', {
              active: bannerData.gonfalonDetailId === detail.imageHash
            })}
          >
            <ObservedImage className='image' src={`https://www.bungie.net${detail.foregroundImagePath}`} />
            <Link to={link} />
          </div>
        );
      });

      configOptions.push(
        <React.Fragment key='gonfalonDetails'>
          <h3>{t('Banner Detail')}</h3>
          <div className='optionSet gonfalonDetails'>{gonfalonDetails}</div>
        </React.Fragment>
      );

      let gonfalonDetailColors = [];

      clanBannerManifest.GonfalonDetailColors.forEach(color => {
        let link = buildLink({ gonfalonDetailColorId: color.colorHash });
        gonfalonDetailColors.push({
          sortValue: color.colorHash,
          element: (
            <div
              key={color.colorHash}
              className={cx('option', 'color', {
                active: bannerData.gonfalonDetailColorId === color.colorHash
              })}
            >
              <div className='box' style={{ backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, ${Math.min(color.alpha, 1)})` }} />
              <Link to={link} />
            </div>
          )
        });
      });

      gonfalonDetailColors.sort((b, a) => a.sortValue - b.sortValue);

      configOptions.push(
        <React.Fragment key='gonfalonDetailColors'>
          <h3>{t('Banner Detail Color')}</h3>
          <div className='optionSet colors gonfalonDetailColors'>{gonfalonDetailColors.map(object => object.element)}</div>
        </React.Fragment>
      );

      let gonfalonColors = [];

      clanBannerManifest.GonfalonColors.forEach(color => {
        let link = buildLink({ gonfalonColorId: color.colorHash });
        gonfalonColors.push({
          sortValue: color.colorHash,
          element: (
            <div
              key={color.colorHash}
              className={cx('option', 'color', {
                active: bannerData.gonfalonColorId === color.colorHash
              })}
            >
              <div className='box' style={{ backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, ${Math.min(color.alpha, 1)})` }} />
              <Link to={link} />
            </div>
          )
        });
      });

      gonfalonColors.sort((b, a) => a.sortValue - b.sortValue);

      configOptions.push(
        <React.Fragment key='gonfalonColors'>
          <h3>{t('Banner Color')}</h3>
          <div className='optionSet colors gonfalonColors'>{gonfalonColors.map(object => object.element)}</div>
        </React.Fragment>
      );
    }

    return (
      <div className='view' id='banner-builder'>
        <div className='banner'>
          <ClanBanner bannerData={bannerData} dark />
        </div>
        <div className='options'>
          <div className='page-header'>
            <div className='name'>{t('Clan Banner Builder')}</div>
          </div>
          <div className='text'>{t("Collaborate with clan members on a new clan banner. Selecting different options instantly updates the page's URL, which allows you to easily share your customisations.")}</div>
          <div className='config'>{this.state.clanBannerManifest ? configOptions : <Spinner dark />}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(ClanBannerBuilder);
