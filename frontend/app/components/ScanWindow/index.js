/**
 *
 * PidForm
 *
 */

import React from "react";
// import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Segment, Menu } from 'semantic-ui-react'

import NoConnection from 'components/NoConnection';
import ScanMenu from 'components/ScanMenu';


function ScanWindow() {
  return (
    <div>
    <NoConnection />
    <Segment attached>
    </Segment>
    <ScanMenu />
    </div>
  );
}

ScanWindow.propTypes = {};

export default ScanWindow;
