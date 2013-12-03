// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet's tooltips.
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

  function Tooltips( model ) {
    var self = this;
    Node.call( this );

    model.spaceObjects.forEach( function( el ) {
      var name = (el === 'spaceStation' ? 'satellite' : el), // change "space station" -> satellite
        body = model[el],
        position = body.position,
        scale = model.planetModes[model.planetMode].options.scale;

      var tooltipText = name === 'sun' ? sunString :
                        name === 'earth' ? earthString :
                        name === 'moon' ? moonString :
                        satelliteString;

      // create tooltip node for each space object
      body.tooltip = new Node( {visible: true, children: [
        new Text( tooltipText, { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: position.x * scale + 15, y: position.y * scale - 30} ),
        new Path( new Shape().moveTo( position.x * scale + 7, position.y * scale - 7 ).lineTo( position.x * scale + 25, position.y * scale - 25 ), {stroke: 'yellow', lineWidth: 1} ),
        new Circle( 25, {fill: 'rgba(0,0,0,0)', x: position.x * scale + 25, y: position.y * scale - 25 } )
      ]} );
      self.addChild( body.tooltip );

      body.explodedProperty.link( function() {
        body.tooltip.setVisible( false );
      } );

      var checkTooltip = function() {
        if ( !isFinite( body.view.getWidth() ) || body.exploded ) {
          body.tooltip.setVisible( false );
        }
        else {
          body.tooltip.setVisible( ( body.view.getWidth() * model.scale < 10 ) );
        }
      };

      model.scaleProperty.link( checkTooltip );
      model.planetModeProperty.link( checkTooltip );
      body.viewProperty.link( checkTooltip );
      body.radiusProperty.link( checkTooltip );
      body.radiusCoeffProperty.link( checkTooltip );

      body.positionProperty.link( function( v ) {
        body.tooltip.setTranslation( v );
      } );

      model.scaleProperty.link( function( newScale ) {
        body.tooltip.resetTransform(); // return to initial proportions
        body.tooltip.scale( 1 / newScale ); // set new scale
      } );
    } );
  }

  return inherit( Node, Tooltips );
} );