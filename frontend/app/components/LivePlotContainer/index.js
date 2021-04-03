
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Segment, Menu, Dropdown, Icon, Input, Popup, Button } from 'semantic-ui-react'

import LivePlotSettings from 'components/LivePlotSettings';
import LivePlot from 'components/LivePlot';


function LivePlotContainer(props) {
  return (
    <div>
      <Menu attached='top' >
        <Menu.Menu position='right'>
          <Popup
            trigger={
              <Menu.Item>
                <Icon name='wrench' />
              </Menu.Item>
            }
            on='click'
            position='bottom right'
          >
            <Popup.Header>Live plot settings</Popup.Header>
            <Popup.Content>
              <LivePlotSettings />
            </Popup.Content>
          </Popup>
        </Menu.Menu>
      </Menu>
      <Segment attached='bottom'>
        <LivePlot />
      </Segment>
    </div>
  );
}

LivePlotContainer.propTypes = {
};

export default LivePlotContainer;
