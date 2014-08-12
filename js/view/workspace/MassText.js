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
   * @constructor
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

        if ( model.planetModes[model.planetMode][spaceObject] && body.massText.isVisible ) {
          text = model.planetModes[model.planetMode][spaceObject].massLabel.text;
          defaultValue = model.planetModes[model.planetMode][spaceObject].massLabel.defaultValue;
          precision = model.planetModes[model.planetMode][spaceObject].massLabel.precision || 0;
          value = (body.massCoeff * defaultValue).toFixed( precision );

          // if value ==== '1.00' replace 1.00 -> 1 and masses -> mass
          body.massText.setText( (value === '1.00' ? value.replace( '1.00', '1' ) + ' ' + text.substr( 0, text.length - 2 ) : value + ' ' + text) );
        }
      };

      // update mass text position
      var setMassTextPosition = function() {
        var height, positions;

        if ( body.massText.isVisible ) {
          height = ( isFinite( body.view.getHeight() ) ? body.view.getHeight() : 0);
          positions = body.position;
          body.massText.setTranslation( positions.x * model.scale - body.massText.getWidth() / 2, (positions.y + height / 2) * model.scale + 15 );
        }
      };

      // update mass text visibility
      var setMassTextVisibility = function() {
        body.massText.setVisible( model.mass && model.planetModes[model.planetMode][spaceObject] && !body.exploded );
      };

      var updateMassText = function() {
        setMassTextVisibility();
        setMassText();
        setMassTextPosition();
      };

      // add observers
      body.explodedProperty.link( setMassTextVisibility );

      model.massProperty.lazyLink( updateMassText );
      model.planetModeProperty.link( updateMassText );

      body.massCoeffProperty.link( setMassText );

      body.positionProperty.lazyLink( setMassTextPosition );
      body.radiusCoeffProperty.lazyLink( setMassTextPosition );
      model.refreshModeProperty.onValue( true, setMassTextPosition );
      model.scaleProperty.link( setMassTextPosition );

      // tune for different view modes
      if ( model.viewMode !== model.viewModes[1] ) {
        model.mass = false;
      }
    } );
  }

  return inherit( Node, MassText );
} );