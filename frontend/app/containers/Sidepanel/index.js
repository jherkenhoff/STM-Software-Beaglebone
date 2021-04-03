import React from 'react';
import PropTypes from "prop-types";

import PidForm from 'components/PidForm';
import { Accordion, Icon, Segment } from "semantic-ui-react";
import styled from 'styled-components';


const StyledAccordion = styled(Accordion)`
  width: 350px !important;
`;

function Sidepanel(props) {
  const panels = [{
      key: "1",
      title: "PID",
      content: {content: <PidForm />},
    },
    {
      key: "2",
      title: "PID",
      content: {content: <PidForm />},
  }]
  return (
      <StyledAccordion
        defaultActiveIndex={[0]}
        panels={panels}
        exclusive={false}
        fluid
        styled
      />
  );
}

Sidepanel.propTypes = {
  className: PropTypes.string
};

export default Sidepanel;
