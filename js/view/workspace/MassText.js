// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of mass label.
 * The label appears below the planet.
 * Measurements are carried out in relative units.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param model {PropertySet} Contains set of properties. Instance of PropertySet class. General model for the whole application.
   */
  function MassText( model ) {
    var massText = this;
    Node.call( this );

    // add text for each space object
    model.spaceObjects.forEach( function( spaceObject ) {
      var body = model[spaceObject];
      massText.addChild( body.massText );

      // update mass text
      var setMassText = function() {
        var text, defaultValue, precision, value;

        if ( model.planetModes[model.planetMode][spaceObject] && !body.exploded ) {
          text = model.planetModes[model.planetMode][spaceObject].massLabel.text;
          defaultValue = model.planetModes[model.planetMode][spaceObject].massLabel.defaultValue;
          precision = model.planetModes[model.planetMode][spaceObject].massLabel.precision || 0;
          value = (body.massCoeff * defaultValue).toFixed( precision );

          // if value ==== '1.00' replace 1.00 -> 1 and masses -> mass
          body.massText.setText( (value === '1.00' ? value.replace( '1.00', '1' ) + ' ' + text.substr( 0, text.length - 2 ) : value + ' ' + text) );
        }
        else {
          body.massText.setText( '' );
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
        body.massText.setVisible( model.mass );
        setMassText();
        setMassTextPosition();
      } );

      body.massCoeffProperty.link( setMassText );

      body.positionProperty.link( setMassTextPosition );

      model.refreshModeProperty.link( function( trigger ) {
        if ( trigger ) {
          setMassTextPosition();
        }
      } );

      body.radiusCoeffProperty.link( setMassTextPosition );

      model.scaleProperty.link( setMassTextPosition );

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