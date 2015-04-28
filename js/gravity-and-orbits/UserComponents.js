// Copyright 2002-2014, University of Colorado

/**
 * UserComponents is an enum of all components that can be interacted with by the user.
 * In the Java version this file was called GAOSimSharing, which only contained the enum UserComponents
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  var UserComponents = {
    showVelocityCheckBox: 'showVelocityCheckBox',
    showMassCheckBox: 'showMassCheckBox',
    showPathCheckBox: 'showPathCheckBox',
    showGridCheckBox: 'showGridCheckBox',
    showMeasuringTapeCheckbox: 'showMeasuringTapeCheckbox',
    showGravityForceCheckBox: 'showGravityForceCheckBox',
    gravityOnRadioButton: 'gravityOnRadioButton',
    gravityOffRadioButton: 'gravityOffRadioButton',
    sunEarthRadioButton: 'sunEarthRadioButton',
    sunEarthMoonRadioButton: 'sunEarthMoonRadioButton',
    earthMoonRadioButton: 'earthMoonRadioButton',
    earthSpaceStationRadioButton: 'earthSpaceStationRadioButton',
    satellite: 'satellite',
    moon: 'moon',
    planet: 'planet',
    star: 'star',
    cartoonTab: 'cartoonTab',
    toScaleTab: 'toScaleTab',
    resetButton: 'resetButton',
    zoomInButton: 'zoomInButton',
    zoomOutButton: 'zoomOutButton'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) {
    Object.freeze && Object.freeze( UserComponents );
  }

  return UserComponents;
} );
