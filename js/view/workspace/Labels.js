// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet's labels.
 * It appears when size of planet less then minimal limit.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 12 );
  var sunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' );
  var earthString = require( 'string!GRAVITY_AND_ORBITS/ourEarth' );
  var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  var moonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );

  function Labels( model ) {
    var self = this;
    Node.call( this );

    model.spaceObjects.forEach( function( el ) {
      var name = (el === 'spaceStation' ? 'satellite' : el), // change "space station" -> satellite
        body = model[el],
        position = body.position,
        scale = model.planetModes[model.planetMode].options.scale;

      var labelText = name === 'sun' ? sunString :
                        name === 'earth' ? earthString :
                        name === 'moon' ? moonString :
                        satelliteString;

      // create label node for each space object
      body.label.addChild( new Text( labelText, { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: position.x * scale + 15, y: position.y * scale - 30} ) );
      body.label.addChild( new Path( new Shape().moveTo( position.x * scale + 7, position.y * scale - 7 ).lineTo( position.x * scale + 25, position.y * scale - 25 ), {stroke: 'yellow', lineWidth: 1} ) );
      body.label.addChild( new Circle( 25, {fill: 'rgba(0,0,0,0)', x: position.x * scale + 25, y: position.y * scale - 25 } ) );
      self.addChild( body.label );

      body.explodedProperty.link( function() {
        body.label.setVisible( false );
      } );

      var checkLabel = function() {
        if ( !isFinite( body.view.getWidth() ) || body.exploded ) {
          body.label.setVisible( false );
        }
        else {
          body.label.setVisible( ( body.view.getWidth() * model.scale < 10 ) );
        }
      };

      model.scaleProperty.link( checkLabel );
      model.planetModeProperty.link( checkLabel );
      body.radiusProperty.link( checkLabel );
      body.radiusCoeffProperty.link( checkLabel );

      body.positionProperty.linkAttribute( body.label, 'translation' );

      model.scaleProperty.link( function( newScale, oldScale ) {
        body.label.scale( (oldScale || 1) ); // return to previous proportions
        body.label.scale( 1 / newScale );
      } );
    } );
  }

  return inherit( Node, Labels );
} );