// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet's labels.
 * It appears when size of planet less then minimal limit.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var sunString = require( 'string!GRAVITY_AND_ORBITS/star' );
  var planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  var moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );

  // constants
  var FONT = new PhetFont( 12 );

  function Labels( model ) {
    var self = this;
    Node.call( this );

    model.spaceObjects.forEach( function( el ) {
      var name = (el === 'spaceStation' ? 'satellite' : el), // change "space station" -> satellite
        body = model[el],
        position = body.position,
        scale = model.planetModes[model.planetMode].options.scale;

      var labelText = name === 'sun' ? sunString :
                      name === 'earth' ? planetString :
                      name === 'moon' ? moonString :
                      satelliteString;

      // create label node for each space object
      body.label.addChild( new Text( labelText, { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: position.x * scale + 15, y: position.y * scale - 30} ) );
      body.label.addChild( new Path( new Shape().moveTo( position.x * scale + 7, position.y * scale - 7 ).lineTo( position.x * scale + 25, position.y * scale - 25 ), {stroke: 'yellow', lineWidth: 1} ) );
      var bodyLabelBounds = body.label.bounds;

      //Add picking region and also go past the text bounds so that it doesn't leave red streaks, see https://github.com/phetsims/gravity-and-orbits/issues/57
      body.label.addChild( new Rectangle( bodyLabelBounds.minX, bodyLabelBounds.minY, bodyLabelBounds.width + 10, bodyLabelBounds.height ) );
      self.addChild( body.label );

      body.explodedProperty.link( function() {
        body.label.setVisible( false );
      } );

      var checkLabel = function() {
        if ( !isFinite( body.view.getWidth() ) || body.exploded ) {
          body.label.setVisible( false );
        }
        else {
          body.label.setVisible( ( body.view.getWidth() * model.scale / body.radiusCoeff < 8 ) );
        }

        //If it just became visible, mkae sure the position is accurate.
        if ( body.label.visible ) {
          body.label.translation = body.position;
        }
      };

      model.scaleProperty.link( checkLabel );
      model.planetModeProperty.link( checkLabel );
      body.radiusProperty.link( checkLabel );
      body.radiusCoeffProperty.link( checkLabel );

      //Update the label location, but only if it is visible (to save on garbage)
      body.positionProperty.link( function( position ) {
        if ( body.label.visible ) {
          body.label.translation = position;
        }
      } );

      model.scaleProperty.link( function( newScale, oldScale ) {
        body.label.scale( (oldScale || 1) ); // return to previous proportions
        body.label.scale( 1 / newScale );
      } );
    } );
  }

  return inherit( Node, Labels );
} );