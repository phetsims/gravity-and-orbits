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

        if ( model.planetModes[model.planetMode][el] && !model[el + 'Exploded'] ) {
          text = model.planetModes[model.planetMode][el].massTooltip.text;
          defaultValue = model.planetModes[model.planetMode][el].massTooltip.defaultValue;
          precision = model.planetModes[model.planetMode][el].massTooltip.precision || 0;

          model[el + 'MassText'].setText( (model[el + 'MassCoeff'] * defaultValue).toFixed( precision ).replace( "1.00", "1" ) + " " + text );
        }
        else {
          model[el + 'MassText'].setText( "" );
        }
      };

      // update mass text position
      var setMassTextPosition = function() {
        if ( !self.visibility ) {return;}
        var height = ( isFinite( model[el + 'View'].getHeight() ) ? model[el + 'View'].getHeight() : 0),
          positions = model[el + 'Position'];

        model[el + 'MassText'].setTranslation( positions.x * model.scale - model[el + 'MassText'].getWidth() / 2, (positions.y + height / 2) * model.scale + 15 );
      };

      // set observers
      model[el + 'ExplodedProperty'].link( function( exploded ) {
        if ( self.visibility ) {
          model[el + 'MassText'].setVisible( !exploded );
        }
      } );

      model.planetModeProperty.link( function() {
        model[el + 'MassText'].setVisible( self.visibility );
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

      model.massProperty.link( function( visibility ) {
        self.visibility = visibility;
        model[el + 'MassText'].setVisible( visibility );
        setMassTextPosition();
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