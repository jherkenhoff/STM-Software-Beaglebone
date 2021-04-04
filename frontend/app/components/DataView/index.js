
import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { List, Transition, Header, Table, Image } from 'semantic-ui-react'


function DataView(props) {

  return (
    <Table basic='very' compact="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell  colSpan='2'>Employee</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>
          <Header as='h4' image>
            <Image src='https://react.semantic-ui.com/images/avatar/small/lena.png' rounded size='mini' />
            <Header.Content>
              Lena
              <Header.Subheader>Human Resources</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>22</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h4' image>
            <Image src='https://react.semantic-ui.com/images/avatar/small/matthew.png' rounded size='mini' />
            <Header.Content>
              Matthew
              <Header.Subheader>Fabric Design</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>15</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h4' image>
            <Image src='https://react.semantic-ui.com/images/avatar/small/lindsay.png' rounded size='mini' />
            <Header.Content>
              Lindsay
              <Header.Subheader>Entertainment</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>12</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h4' image>
            <Image src='https://react.semantic-ui.com/images/avatar/small/mark.png' rounded size='mini' />
            <Header.Content>
              Mark
              <Header.Subheader>Executive</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>11</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
  );
}

DataView.propTypes = {
  logs: PropTypes.array
};

export default DataView;
