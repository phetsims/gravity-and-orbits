// Copyright 2021-2022, University of Colorado Boulder
import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../gravityAndOrbits.js';

const GravityAndOrbitsColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( gravityAndOrbits, 'foreground', {
    default: 'white',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'foregroundColorProperty' )
  } ),

  // Color mainly used for background things like panels or text backgrounds
  backgroundProperty: new ProfileColorProperty( gravityAndOrbits, 'background', {
    default: 'black',
    projector: 'white'
  }, {
    tandem: Tandem.COLORS.createTandem( 'backgroundColorProperty' )
  } ),
  bodyLabelIndicatorProperty: new ProfileColorProperty( gravityAndOrbits, 'body label indicator', {
    default: new Color( 255, 255, 0 ),
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'labelColorProperty' )
  } ),

  measuringTapeTextBackgroundColorProperty: new ProfileColorProperty( gravityAndOrbits, 'measuring tape text background', {
    default: 'rgba( 0, 0, 0, 0.65 )',
    projector: 'rgba( 255, 255, 255, 0.65 )'
  }, {
    tandem: Tandem.COLORS.createTandem( 'measuringTapeTextBackgroundColorProperty' )
  } ),

  gridIconStrokeColorProperty: new ProfileColorProperty( gravityAndOrbits, 'grid icon stroke', {
    default: 'gray',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'gridIconStrokeColorProperty' )
  } ),

  controlPanelFillProperty: new ProfileColorProperty( gravityAndOrbits, 'control panel fill', {
    default: 'black',
    projector: new Color( 222, 234, 255 )
  } )
};

gravityAndOrbits.register( 'GravityAndOrbitsColors', GravityAndOrbitsColors );

export default GravityAndOrbitsColors;