import { createGlobalStyle } from 'styled-components';

import 'semantic-ui-css/semantic.min.css'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const GlobalStyle = createGlobalStyle`
  html, body, #app {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
`;

export default GlobalStyle;
