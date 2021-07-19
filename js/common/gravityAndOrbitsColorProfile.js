// Copyright 2021, University of Colorado Boulder
import Color from '../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../gravityAndOrbits.js';

const gravityAndOrbitsColorProfile = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( 'foreground', { default: 'white', projector: 'black' }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'foregroundColorProperty' )
  } ),

  // Color mainly used for background things like panels or text backgrounds
  backgroundProperty: new ProfileColorProperty( 'background', {
    default: 'black',
    projector: 'white'
  }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'backgroundColorProperty' )
  } ),
  bodyLabelIndicatorProperty: new ProfileColorProperty( 'body label indicator', { default: new Color( 255, 255, 0 ), projector: 'black' }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'labelColorProperty' )
  } ),

  measuringTapeTextBackgroundColorProperty: new ProfileColorProperty( 'measuring tape text background', {
    default: 'rgba( 0, 0, 0, 0.65 )',
    projector: 'rgba( 255, 255, 255, 0.65 )'
  }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'measuringTapeTextBackgroundColorProperty' )
  } ),

  gridIconStrokeProperty: new ProfileColorProperty( 'grid icon stroke', { default: 'gray', projector: 'black' }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'gridCheckboxStrokeProperty' )
  } ),

  controlPanelFillProperty: new ProfileColorProperty( 'control panel fill', {
    default: 'black',
    projector: new Color( 222, 234, 255 )
  } )
};

gravityAndOrbits.register( 'gravityAndOrbitsColorProfile', gravityAndOrbitsColorProfile );

export default gravityAndOrbitsColorProfile;