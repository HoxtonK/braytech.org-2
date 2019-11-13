import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { groupBy } from 'lodash';

import manifest from '../../../../utils/manifest';
import * as ls from '../../../../utils/localStorage';
import * as bungie from '../../../../utils/bungie';
import Items from '../../../../components/Items';
import Spinner from '../../../../components/UI/Spinner';
import { NoAuth, DiffProfile } from '../../../../components/BungieAuth';

import './styles.css';

class Vendor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: false
    };

    this.auth = ls.get('setting.auth');
  }

  componentDidMount() {
    const { hash: vendorHash } = this.props;

    this.getVendor(vendorHash)
  }

  componentDidUpdate(p, s) {
    if (s.loading !== this.state.loading) {
      this.props.rebindTooltips();
    }
  }

  getVendor = async hash => {
    const { member } = this.props;

    const response = await bungie.GetVendor(member.membershipType, member.membershipId, member.characterId, hash, [400, 402, 300, 301, 304, 305, 306, 307, 308, 600].join(','));

    if (response) {
      this.setState({
        loading: false,
        data: response
      });
    } else {
      this.setState(p => ({
        ...p,
        loading: false
      }));
    }
  }

  render() {
    const { t, member, hash: vendorHash } = this.props;
    
    if (!this.auth) {
      return <NoAuth inline />;
    }

    if (this.auth && !this.auth.destinyMemberships.find(m => m.membershipId === member.membershipId)) {
      return <DiffProfile inline />;
    }

    const definitionVendor = manifest.DestinyVendorDefinition[vendorHash];

    if (this.auth && this.auth.destinyMemberships.find(m => m.membershipId === member.membershipId) && this.state.loading) {
      return (
        <>
          <div className='module-header'>
            <div className='sub-name'>{definitionVendor.displayProperties.name}</div>
          </div>
          <Spinner />
        </>
      );
    }

    console.log(this.state.data)

    const items = [];

    if (this.state.data) {
      Object.values(this.state.data.sales.data).forEach(sale => {

        items.push({
          vendorHash: definitionVendor.hash,
          ...sale,
          ...(sale.vendorItemIndex !== undefined && definitionVendor && definitionVendor.itemList && definitionVendor.itemList[sale.vendorItemIndex]) || {}
        })

      });
    }

    const itemsGrouped = groupBy(items, i => i.displayCategoryIndex);

    // const displayCategories = [...definitionVendor.displayCategories];

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{definitionVendor.displayProperties.name}</div>
        </div>
        {definitionVendor.displayCategories.map((category, c) => {

          if (itemsGrouped[category.index]) {
            return (
              <React.Fragment key={c}>
                <h4>{category.displayProperties.name}</h4>
                <ul className='list inventory-items'>
                  <Items items={itemsGrouped[category.index]} />
                </ul>
              </React.Fragment>
            )
          } else {
            return null;
          }
          
        })}
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Vendor);
