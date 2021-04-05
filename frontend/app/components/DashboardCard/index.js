
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';


import { Menu, Segment, Icon, Label } from 'semantic-ui-react'


const DashboardCardWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1px; // Fix hidden borders
`;

const GrowingSegment = styled(Segment)`
  flex: 1;
  overflow: auto;
`;


function DashboardCard(props) {
  return (
    <DashboardCardWrapper>
      <Menu borderless attached="top" className="drag-handle">
        <Menu.Item header>{props.title}</Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item>
            <Icon name='times' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <GrowingSegment attached="bottom" loading={props.loading || false}>
        {props.children}
      </GrowingSegment>
    </DashboardCardWrapper>
  );
}

DashboardCard.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool
};

export default DashboardCard;
