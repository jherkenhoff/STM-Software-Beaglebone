
import React from 'react';

import AutoApproachContainer from 'containers/AutoApproachContainer';
import BiasVoltageContainer from 'containers/BiasVoltageContainer';
import CoarseApproachContainer from 'containers/CoarseApproachContainer';
import CurrentGaugeContainer from 'containers/GaugeContainers/CurrentGaugeContainer';
import DashboardCard from 'components/DashboardCard';
import DataViewContainer from 'containers/DataViewContainer';
import EnvironmentPlotContainer from 'containers/EnvironmentPlotContainer';
import LogContainer from 'containers/LogContainer';
import MainboardTempGaugeContainer from 'containers/GaugeContainers/MainboardTempGaugeContainer';
import ManualPositionContainer from 'containers/ManualPositionContainer';
import OsciPlotContainer from 'containers/OsciPlotContainer';
import PidSettingsContainer from 'containers/PidSettingsContainer';
import PlotWindow from 'components/PlotWindow';
import ScanSetupContainer from 'containers/ScanSetupContainer';
import ScanViewContainer from 'containers/ScanViewContainer';
import ScanWindow from 'components/ScanWindow';
import SupplyTempGaugeContainer from 'containers/GaugeContainers/SupplyTempGaugeContainer';
import TipPlotContainer from 'containers/TipPlotContainer';
import ZGaugeContainer from 'containers/GaugeContainers/ZGaugeContainer';

export default [
  {
    widgetType: "auto-approach",
    name: "Auto Approach",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <AutoApproachContainer />
  },
  {
    widgetType: "bias-voltage",
    name: "Bias Voltage",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <BiasVoltageContainer />
  },
  {
    widgetType: "current-gauge",
    name: "Current Gauge",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <CurrentGaugeContainer />
  },
  {
    widgetType: "z-gauge",
    name: "Z Gauge",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <ZGaugeContainer />
  },
  {
    widgetType: "mainboard-temp-gauge",
    name: "Mainboard Temp. Gauge",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <MainboardTempGaugeContainer />
  },
  {
    widgetType: "supply-temp-gauge",
    name: "Supply Temp. Gauge",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <SupplyTempGaugeContainer />
  },
  {
    widgetType: "coarse-approach",
    name: "Coarse Approach",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <CoarseApproachContainer />
  },
  {
    widgetType: "environmental-monitor",
    name: "Environmental Monitor",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <EnvironmentPlotContainer />
  },
  {
    widgetType: "system-log",
    name: "System Log",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <LogContainer />
  },
  {
    widgetType: "manual-position",
    name: "Manual Position",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <ManualPositionContainer />
  },
  {
    widgetType: "oscilloscope",
    name: "Oscilloscope",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <OsciPlotContainer />
  },
  {
    widgetType: "pid-settings",
    name: "PID Settings",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <PidSettingsContainer />
  },
  {
    widgetType: "scan-setup",
    name: "Scan Setup",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <ScanSetupContainer />
  },
  {
    widgetType: "scan-view",
    name: "Scan View",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <ScanViewContainer />
  },
  {
    widgetType: "tip-plot",
    name: "Tip Plot",
    defaultW: undefined,
    defaultH: undefined,
    minW: undefined,
    maxW: undefined,
    minH: undefined,
    maxH: undefined,
    isResizable: true,
    component: <TipPlotContainer />
  },
]
