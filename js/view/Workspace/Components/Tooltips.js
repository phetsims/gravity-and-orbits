// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for tooltips
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
        position = model[el + 'Position'],
        scale = model.planetModes[model.planetMode].options.scale;

      var tooltipText = name === 'sun' ? sunString :
                        name === 'earth' ? earthString :
                        name === 'moon' ? moonString :
                        satelliteString;
      model[el + 'Tooltip'] = new Node( {visible: true, children: [
        new Text( tooltipText, { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: position.x * scale + 15, y: position.y * scale - 30} ),
        new Path( new Shape().moveTo( position.x * scale + 7, position.y * scale - 7 ).lineTo( position.x * scale + 25, position.y * scale - 25 ), {stroke: 'yellow', lineWidth: 1} ),
        new Circle( 25, {fill: 'rgba(0,0,0,0)', x: position.x * scale + 25, y: position.y * scale - 25 } )
      ]} );
      self.addChild( model[el + 'Tooltip'] );

      model[el + 'ExplodedProperty'].link( function() {
        model[el + 'Tooltip'].setVisible( false );
      } );

      var checkTooltip = function() {
        if ( !isFinite( model[el + 'View'].getWidth() ) || model[el + 'Exploded'] ) {
          model[el + 'Tooltip'].setVisible( false );
        }
        else {
          model[el + 'Tooltip'].setVisible( ( model[el + 'View'].getWidth() * model.scale < 10 ) );
        }
      };

      model.scaleProperty.link( checkTooltip );
      model.viewModeProperty.link( checkTooltip );
      model.planetModeProperty.link( checkTooltip );
      model[el + 'ViewProperty'].link( checkTooltip );
      model[el + 'RadiusProperty'].link( checkTooltip );
      model[el + 'RadiusCoeffProperty'].link( checkTooltip );

      model[el + 'PositionProperty'].link( function( vect ) {
        model[el + 'Tooltip'].x = vect.x;
        model[el + 'Tooltip'].y = vect.y;
      } );

      model.scaleProperty.link( function( newScale, oldScale ) {
        model[el + 'Tooltip'].scale( (oldScale || 1) );
        model[el + 'Tooltip'].scale( 1 / newScale );
      } );
    } );

  }

  inherit( Node, Tooltips );

  return Tooltips;
} );