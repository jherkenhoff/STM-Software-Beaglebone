
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Statistic } from 'semantic-ui-react'


function TunnelingStatus(props) {

  return (
    <Statistic.Group widths={3} size="small">
      <Statistic>
        <Statistic.Value>22</Statistic.Value>
        <Statistic.Label>Faves</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>31,200</Statistic.Value>
        <Statistic.Label>Views</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>22</Statistic.Value>
        <Statistic.Label>Members</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  );
}

TunnelingStatus.propTypes = {
  logs: PropTypes.array
};

export default TunnelingStatus;
