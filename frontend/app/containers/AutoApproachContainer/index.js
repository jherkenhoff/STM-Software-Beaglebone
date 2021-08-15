
import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import DashboardCard from 'components/DashboardCard';
import AutoApproach from 'components/AutoApproach';
import {
  setAutoApproachEnable,
  setAutoApproachStepperInc,
  setAutoApproachZInc,
  setAutoApproachZLow,
  setAutoApproachZHigh,
  setAutoApproachZGoal,
  setAutoApproachCurrentGoal
} from "actions/autoApproach";

function AutoApproachContainer(props) {
  return (
    <DashboardCard title="Auto Approach">
      <AutoApproach
        enable={props.enable}
        stepperInc={props.stepperInc}
        zInc={props.zInc}
        zLow={props.zLow}
        zHigh={props.zHigh}
        zGoal={props.zGoal}
        currentGoal={props.currentGoal}
        iteration={props.iteration}

        onEnableChange={props.onEnableChange}
        onStepperIncChange={props.onStepperIncChange}
        onZIncChange={props.onZIncChange}
        onZLowChange={props.onZLowChange}
        onZHighChange={props.onZHighChange}
        onZGoalChange={props.onZGoalChange}
        onCurrentGoalChange={props.onCurrentGoalChange}
      />
    </DashboardCard>
  );
}

function mapStateToProps(state) {
  return {
    enable: state.autoApproach.enable,
    stepperInc: state.autoApproach.stepperInc,
    zInc: state.autoApproach.zInc,
    zLow: state.autoApproach.zLow,
    zHigh: state.autoApproach.zHigh,
    zGoal: state.autoApproach.zGoal,
    currentGoal: state.autoApproach.currentGoal,
    iteration: state.autoApproach.iteration
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onEnableChange: (v) => dispatch(setAutoApproachEnable(v)),
    onStepperIncChange: (v) => dispatch(setAutoApproachStepperInc(v)),
    onZIncChange: (v) => dispatch(setAutoApproachZInc(v)),
    onZLowChange: (v) => dispatch(setAutoApproachZLow(v)),
    onZHighChange: (v) => dispatch(setAutoApproachZHigh(v)),
    onZGoalChange: (v) => dispatch(setAutoApproachZGoal(v)),
    onCurrentGoalChange: (v) => dispatch(setAutoApproachCurrentGoal(v))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(AutoApproachContainer);
