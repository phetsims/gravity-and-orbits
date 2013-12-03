// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of mass tooltip.
 * The tooltip appears below the planet.
 * Measurements are carried out in relative units.
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
      var body = model[el];
      body.massText = new Text( "", { visible: true, font: FONT, fontWeight: 'bold', textAlign: 'center', fill: 'white', pickable: false} );
      self.addChild( body.massText );

      // update mass text
      var setMassText = function() {
        var text, defaultValue, precision;

        if ( model.planetModes[model.planetMode][el] && !body.exploded ) {
          text = model.planetModes[model.planetMode][el].massTooltip.text;
          defaultValue = model.planetModes[model.planetMode][el].massTooltip.defaultValue;
          precision = model.planetModes[model.planetMode][el].massTooltip.precision || 0;

          body.massText.setText( (body.massCoeff * defaultValue).toFixed( precision ).replace( "1.00", "1" ) + " " + text );
        }
        else {
          body.massText.setText( "" );
        }
      };

      // update mass text position
      var setMassTextPosition = function() {
        if ( !model.mass ) {return;} // check visibility
        var height = ( isFinite( body.view.getHeight() ) ? body.view.getHeight() : 0),
          positions = body.position;

        body.massText.setTranslation( positions.x * model.scale - body.massText.getWidth() / 2, (positions.y + height / 2) * model.scale + 15 );
      };

      // add observers
      body.explodedProperty.link( function( exploded ) {
        if ( model.mass ) { // check visibility
          body.massText.setVisible( !exploded );
        }
      } );

      model.planetModeProperty.link( function() {
        body.massText.setVisible( self.visibility );
        setMassText();
        setMassTextPosition();
      } );

      body.massCoeffProperty.link( function() {
        setMassText();
      } );

      body.positionProperty.link( function() {
        setMassTextPosition();
      } );

      body.viewProperty.link( function() {
        setMassTextPosition();
      } );

      model.refreshModeProperty.link( function( trigger ) {
        if ( trigger ) {
          setMassTextPosition();
        }
      } );

      body.radiusCoeffProperty.link( function() {
        setMassTextPosition();
      } );

      model.scaleProperty.link( function() {
        setMassTextPosition();
      } );

      model.massProperty.link( function( visibility ) {
        body.massText.setVisible( visibility );
        setMassTextPosition();
      } );

      // tune for different view modes
      if ( model.viewMode !== model.viewModes[1] ) {
        model.mass = false;
      }
      else {
        setMassText();
        setMassTextPosition();
      }
    } );
  }

  return inherit( Node, MassText );
} );