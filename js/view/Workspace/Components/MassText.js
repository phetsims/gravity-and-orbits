// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for planet's mass text
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 12 );

  function MassText( model ) {
    var self = this;
    Node.call( this );

    // add text for each space object
    model.spaceObjects.forEach( function( el ) {
      model[el + 'MassText'] = new Text( "", { visible: true, font: FONT, fontWeight: 'bold', textAlign: 'center', fill: 'white', pickable: false} );
      self.addChild( model[el + 'MassText'] );

      // update mass text
      var setMassText = function() {
        var text, defaultValue, precision;

        if ( model.planetModes[model.planetMode][el] ) {
          text = model.planetModes[model.planetMode][el].massTooltip.text;
          defaultValue = model.planetModes[model.planetMode][el].massTooltip.defaultValue;
          precision = model.planetModes[model.planetMode][el].massTooltip.precision || 0;

          model[el + 'MassText'].setText( (model[el + 'MassCoeff'] * defaultValue).toFixed( precision ).replace( "1.00", "1" ).replace( ".", "," ) + " " + text );
        }
        else {
          model[el + 'MassText'].setText( "" );
        }
      };

      // update mass text position
      var setMassTextPosition = function() {
        var height = ( isFinite( model[el + 'View'].getHeight() ) ? model[el + 'View'].getHeight() : 0),
          positions = model[el + 'Position'];

        model[el + 'MassText'].x = positions.x * model.scale - model[el + 'MassText'].getWidth() / 2;
        model[el + 'MassText'].y = (positions.y + height / 2) * model.scale + 15;
      };

      // set observers
      model.planetModeProperty.link( function() {
        setMassText();
        setMassTextPosition();
      } );

      model[el + 'MassCoeffProperty'].link( function() {
        setMassText();
      } );

      model[el + 'PositionProperty'].link( function() {
        setMassTextPosition();
      } );

      model[el + 'RadiusCoeffProperty'].link( function() {
        setMassTextPosition();
      } );

      model.scaleProperty.link( function() {
        setMassTextPosition();
      } );

      model.massProperty.link( function( flag ) {
        model[el + 'MassText'].setVisible( flag );
      } );

      model.viewModeProperty.link( function( mode ) {
        if ( mode !== model.viewModes[1] ) {
          model.mass = false;
        }
        else {
          setMassText();
          setMassTextPosition();
        }
      } );
    } );

  }

  inherit( Node, MassText );

  return MassText;
} );