import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import './styles.css';

import UI from './UI';
import Item from './Item';
import Activity from './Activity';
import Vendor from './Vendor';
import Stat from './Stat';
import { Checklist, Record, Node } from './Maps';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: false,
      table: false,
      data: {}
    };

    this.ref_tooltip = React.createRef();
    this.touchMovement = false;
    this.mousePosition = {
      x: 0,
      y: 0
    };
    this.rAF = null;
  }

  helper_tooltipPositionUpdate = () => {
    if (this.ref_tooltip.current) {
      this.ref_tooltip.current.style.transform = `translate(${this.mousePosition.x}px, ${this.mousePosition.y}px)`;
    }

    window.requestAnimationFrame(this.helper_tooltipPositionUpdate);
  }

  helper_windowMouseMove = e => {
    let x = 0;
    let y = 0;
    let offset = 0;
    let tooltipWidth = 440;
    let tooltipHeight = this.state.hash ? this.ref_tooltip.current.clientHeight : 0;
    let scrollbarAllowance = 24;

    x = e.clientX;
    y = e.clientY - (tooltipHeight >= 320 ? 140 : 0);

    if (x + tooltipWidth + scrollbarAllowance > window.innerWidth / 2 + tooltipWidth) {
      x = x - tooltipWidth - scrollbarAllowance - offset;
    } else {
      x = x + scrollbarAllowance + offset;
    }

    if (y + tooltipHeight + scrollbarAllowance > window.innerHeight) {
      y = window.innerHeight - tooltipHeight - scrollbarAllowance;
    }
    y = y < scrollbarAllowance ? scrollbarAllowance : y;

    if (this.state.hash) {
      this.mousePosition = {
        x,
        y
      };
    }
  };

  helper_targetMouseEnter = e => {
    if (e.currentTarget.dataset.hash) {
      this.setState({
        hash: e.currentTarget.dataset.hash,
        table: e.currentTarget.dataset.table,
        data: {
          ...e.currentTarget.dataset
        }
      });
      this.helper_windowMouseMove(e);
    }
  };

  helper_targetMouseLeave = e => {
    window.cancelAnimationFrame(this.rAF);
    
    this.resetState();
  };

  helper_targetTouchStart = e => {
    this.touchMovement = false;
  };

  helper_targetTouchMove = e => {
    this.touchMovement = true;
  };

  helper_targetTouchEnd = e => {
    if (!this.touchMovement) {
      if (e.currentTarget.dataset.hash) {
        this.setState({
          hash: e.currentTarget.dataset.hash,
          table: e.currentTarget.dataset.table,
          data: {
            ...e.currentTarget.dataset
          }
        });
      }
    }
  };

  helper_tooltipTouchStart = e => {
    this.touchMovement = false;
  };

  helper_tooltipTouchMove = e => {
    this.touchMovement = true;
  };

  helper_tooltipTouchEnd = e => {
    e.preventDefault();
    if (!this.touchMovement) {
      this.resetState();
    }
  };

  resetState = () => {
    this.setState({
      hash: false,
      table: false,
      data: {}
    });
    this.mousePosition = {
      x: 0,
      y: 0
    };
  };

  bind_TooltipItem = reset => {
    if (reset) {
      this.resetState();
    }

    let targets = document.querySelectorAll('.tooltip');
    targets.forEach(target => {
      target.addEventListener('touchstart', this.helper_targetTouchStart);
      target.addEventListener('touchmove', this.helper_targetTouchMove);
      target.addEventListener('touchend', this.helper_targetTouchEnd);
      target.addEventListener('mouseenter', this.helper_targetMouseEnter);
      target.addEventListener('mouseleave', this.helper_targetMouseLeave);
    });
  };

  bind_Tooltip = () => {
    this.ref_tooltip.current.addEventListener('touchstart', this.helper_tooltipTouchStart);
    this.ref_tooltip.current.addEventListener('touchmove', this.helper_tooltipTouchMove);
    this.ref_tooltip.current.addEventListener('touchend', this.helper_tooltipTouchEnd);
  };

  componentDidUpdate(prevProps) {
    if (this.props.tooltips.bindTime !== prevProps.tooltips.bindTime) {
      this.bind_TooltipItem();
    }

    if (this.props.location && prevProps.location.pathname !== this.props.location.pathname) {
      // console.log('location change');
      this.bind_TooltipItem(true);
    }

    if (this.props.member.data !== prevProps.member.data) {
      this.bind_TooltipItem();
    }

    if (this.state.hash) {
      this.bind_Tooltip();
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.helper_windowMouseMove);
    this.rAF = window.requestAnimationFrame(this.helper_tooltipPositionUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.helper_windowMouseMove);
    window.cancelAnimationFrame(this.rAF);
  }

  render() {

    let Tooltip = Item;

    if (this.state.hash) {
      if (this.state.table === 'BraytechDefinition') Tooltip = UI;
      if (this.state.table === 'DestinyHistoricalStatsDefinition') Tooltip = Stat;
      if (this.state.table === 'DestinyActivityDefinition') Tooltip = Activity;
      if (this.state.table === 'DestinyVendorDefinition') Tooltip = Vendor;
      if (this.state.table === 'DestinyChecklistDefinition') Tooltip = Checklist;
      if (this.state.table === 'DestinyRecordDefinition') Tooltip = Record;
      if (this.state.table === 'BraytechMapsDefinition') Tooltip = Node;
    }

    return (
      <div ref={this.ref_tooltip} id='tooltip' className={cx({ visible: this.state.hash })}>
        {this.state.hash ? <Tooltip {...this.state.data} /> : null}
      </div>
    );
    
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    tooltips: state.tooltips
  };
}

export default connect(
  mapStateToProps
)(Tooltip);
