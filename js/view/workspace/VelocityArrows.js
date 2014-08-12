// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of velocity arrows.
 * It shows the direction and amplitude of the current velocity.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var MutableArrowNode = require( 'SCENERY_PHET/MutableArrowNode' );

  // constants
  var ARROW_SIZE_DEFAULT = 160;
  var FONT = new PhetFont( 22 );

  /**
   * @param model {PropertySet} Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function VelocityArrows( model ) {
    var velocityArrows = this, prevPosition = {};
    Node.call( this );

    this.arrows = {};
    // init arrow view for each space object
    model.spaceObjects.forEach( function( spaceObject ) {
      velocityArrows.arrows[spaceObject] = {
        view: new Node( {cursor: 'pointer', visible: false} ),
        circle: new Node( {children: [new Circle( 18, {
          fill: 'rgba(0,0,0,0)',
          stroke: '#C0C0C0',
          lineWidth: 3
        } ),
          //Create the text to show in the velocity arrow.  Note, this uses boundsMethod: 'accurate' so it will be perfectly centered in the circle, but this is
          //a potentially unstable feature, and may increase the startup time of the simulation
          new Text( 'v', { font: FONT, fontWeight: 'bold', fill: '#808080', centerX: 0, centerY: 0, pickable: false, boundsMethod: 'accurate' } )
        ]} ),
        arrowNode: new MutableArrowNode( 0, 0, 0, 0, {fill: '#ED1C24', headHeightMaximumHalf: true} )
      };

      // init drag and drop for arrow
      velocityArrows.arrows[spaceObject].circle.addInputListener( new SimpleDragHandler( {
        translate: function( e ) {
          var velocity = e.position.minus( model[spaceObject].position ), amplitude = velocity.magnitude() * velocityArrows.maxVelocity[model.planetMode] / ARROW_SIZE_DEFAULT;
          velocityArrows.redrawArrow( model, spaceObject, e.position );
          model[spaceObject].velocity.set( velocity.normalized().multiply( amplitude ) );
        }
      } ) );

      // add arrow's components to view and add view to main node
      velocityArrows.arrows[spaceObject].view.addChild( velocityArrows.arrows[spaceObject].circle );
      velocityArrows.arrows[spaceObject].view.addChild( velocityArrows.arrows[spaceObject].arrowNode );
      velocityArrows.addChild( velocityArrows.arrows[spaceObject].view );
    } );

    // find max velocity for all modes
    this.maxVelocity = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      this.maxVelocity[i] = getMaxVelocity( model, i );
    }

    // add observers
    model.spaceObjects.forEach( function( spaceObject ) {
      prevPosition[spaceObject] = model[spaceObject].position.copy();

      // add position property observer
      model[spaceObject].positionProperty.link( function( newPosition ) {
        // update velocity arrow if position was changed significantly
        if ( newPosition.minus( prevPosition[spaceObject] ).magnitude() > 1 ) {
          prevPosition[spaceObject] = newPosition.copy();
          velocityArrows.updateArrows( model );
        }
      } );
    } );

    var setArrowsVisibilityAndUpdateBinded = setArrowsVisibilityAndUpdate.bind( this, model );
    // check velocity arrow if visibility changed
    model.velocityArrowProperty.link( setArrowsVisibilityAndUpdateBinded );

    // check velocity arrow if planet mode was changed
    model.planetModeProperty.link( setArrowsVisibilityAndUpdateBinded );

    // check velocity arrow if refresh was called
    model.refreshModeProperty.onValue( true, setArrowsVisibilityAndUpdateBinded );

    model.spaceObjects.forEach( function( spaceObject ) {
      model[spaceObject].explodedProperty.link( setArrowsVisibilityAndUpdateBinded );
    } );
  }

  // set visibility of arrows and update size
  var setArrowsVisibilityAndUpdate = function( model ) {
    var velocityArrows = this;

    // set visibility of arrows
    model.spaceObjects.forEach( function( spaceObject ) {
      if ( !model.velocityArrow || !model.planetModes[model.planetMode][spaceObject] || model[spaceObject].exploded || !model[spaceObject].velocity.magnitude() ) {
        velocityArrows.arrows[spaceObject].view.setVisible( false );
      }
      else {
        velocityArrows.arrows[spaceObject].view.setVisible( true );
      }
    } );

    // update size of arrows
    velocityArrows.updateArrows( model );
  };

  // find max value of start velocity for given planet mode
  var getMaxVelocity = function( model, num ) {
    var mode = model.planetModes[num], obj, len = model.spaceObjects.length, i, v, maxVelocity = 1;
    for ( i = 0; i < len; i++ ) {
      obj = model.spaceObjects[i];
      if ( !mode[obj] || !mode[obj].velocity ) {continue;} // take next object if current doesn't exist for given mode
      v = mode[obj].velocity.magnitude();
      maxVelocity = Math.max( v, maxVelocity );
    }
    return maxVelocity;
  };

  return inherit( Node, VelocityArrows, {
    // redraw single arrow view
    redrawArrow: function( model, obj, arrowTipVector ) {
      this.arrows[obj].circle.setTranslation( arrowTipVector );
      this.arrows[obj].arrowNode.setTailAndTip( model[obj].position.x, model[obj].position.y, arrowTipVector.x, arrowTipVector.y );
    },
    // update arrow size for visible arrows
    updateArrows: function( model ) {
      var velocityArrows = this,
        num = model.planetMode,
        maxVelocity = velocityArrows.maxVelocity[num],
        arrowSize,
        velocity,
        arrowTipVector,
        unitVector;

      model.spaceObjects.forEach( function( spaceObject ) {
        // update only visible arrows
        if ( velocityArrows.arrows[spaceObject].view.visible ) {
          velocity = model[spaceObject].velocity;

          // calculate new arrow size
          arrowSize = ARROW_SIZE_DEFAULT * velocity.magnitude() / maxVelocity;
          unitVector = velocity.normalized();
          arrowTipVector = model[spaceObject].position.plus( unitVector.multiply( arrowSize ) );

          // redraw arrow
          velocityArrows.redrawArrow( model, spaceObject, arrowTipVector );
        }
      } );
    }
  } );
} );