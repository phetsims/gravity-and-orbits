// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of velocity arrows.
 * It shows the direction and amplitude of the current velocity.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    Circle = require( 'SCENERY/nodes/Circle' ),
    SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' ),
    Text = require( 'SCENERY/nodes/Text' ),
    PhetFont = require( 'SCENERY_PHET/PhetFont' ),
    FONT = new PhetFont( 22 ),
    MutableArrowNode = require( 'SCENERY_PHET/MutableArrowNode' );

  function VelocityArrows( model ) {
    var self = this, prevPosition = {};
    Node.call( this );

    this.init( model ); // prepare component for work

    // find max velocity for all modes
    this.maxVelocity = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      this.maxVelocity[i] = getMaxVelocity( model, i );
    }

    // controls the visibility and direction of arrows
    var checkArrows = function() {
      self[(model.velocityArrow ? 'show' : 'hide') + 'Arrows']( model );
    };

    // add observers
    model.spaceObjects.forEach( function( el ) {
      prevPosition[el] = model[el].position.copy();

      // add position property observer
      model[el].positionProperty.link( function( newPosition ) {
        // update velocity arrow if position was changed significantly
        if ( newPosition.minus( prevPosition[el] ).magnitude() > 1 ) {
          prevPosition[el] = newPosition.copy();
          checkArrows();
        }
      } );
    } );

    // check velocity arrow if visibility changed
    model.velocityArrowProperty.link( checkArrows );

    // check velocity arrow if planet mode was changed
    model.planetModeProperty.link( checkArrows );

    // check velocity arrow if refresh was called
    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        checkArrows();
      }
    } );
  }

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
    init: function( model ) {
      var self = this;
      this.arrowSizeNormal = 160;
      this.arrows = {};
      model.spaceObjects.forEach( function( el ) {
        // init arrow view for each space object
        self.arrows[el] = {
          view: new Node( {cursor: 'pointer'} ),
          circle: new Circle( 18, {
            fill: 'rgba(0,0,0,0)',
            stroke: '#C0C0C0',
            lineWidth: 3
          } ),

          //Create the text to show in the velocity arrow.  Note, this uses boundsMethod: 'accurate' so it will be perfectly centered in the circle, but this is
          //a potentially unstable feature, and may increase the startup time of the simulation
          text: new Text( 'v', { font: FONT, fontWeight: 'bold', fill: '#808080', pickable: false, boundsMethod: 'accurate' } ),
          arrowNode: new MutableArrowNode( 0, 0, 0, 0, {fill: '#ED1C24', headHeightMaximumHalf: true} )
        };

        // init drag and drop for arrow
        self.arrows[el].circle.addInputListener( new SimpleDragHandler( {
          translate: function( e ) {
            var velocity = e.position.minus( model[el].position ), amplitude = velocity.magnitude() * self.maxVelocity[model.planetMode] / self.arrowSizeNormal;
            self.setArrow( model, el, e.position );
            model[el].velocity.set( velocity.normalized().multiply( amplitude ) );
          }
        } ) );

        // add arrow's components to view and add view to main node
        self.arrows[el].view.addChild( self.arrows[el].circle );
        self.arrows[el].view.addChild( self.arrows[el].text );
        self.arrows[el].view.addChild( self.arrows[el].arrowNode );
        self.arrows[el].view.setVisible( false );
        self.addChild( self.arrows[el].view );
      } );
    },
    hideArrows: function( model ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        self.arrows[el].view.setVisible( false );
      } );
    },
    setArrow: function( model, obj, v ) {
      this.arrows[obj].circle.setTranslation( v );
      this.arrows[obj].text.setTranslation( v.x - this.arrows[obj].text.width / 2, v.y + this.arrows[obj].text.height / 2 );
      this.arrows[obj].arrowNode.setTailAndTip( model[obj].position.x, model[obj].position.y, v.x, v.y );
    },
    showArrows: function( model ) {
      var self = this,
        num = model.planetMode,
        maxVelocity = self.maxVelocity[num],
        mode = model.planetModes[num],
        arrowSize = 0,
        arrowSizeMin = 10,
        arrowSizeNormal = self.arrowSizeNormal,
        len = model.spaceObjects.length,
        velocity,
        obj,
        unitVector;

      for ( var i = 0, v; i < len; i++ ) {
        obj = model.spaceObjects[i];
        velocity = model[obj].velocity;
        if ( !mode[obj] || model[obj].exploded || !velocity.magnitude() ) {
          self.arrows[obj].view.setVisible( false );
          continue;
        }

        arrowSize = arrowSizeNormal * velocity.magnitude() / maxVelocity;
        arrowSize = Math.max( arrowSize, arrowSizeMin );

        unitVector = velocity.normalized();
        v = model[obj].position.plus( unitVector.multiply( arrowSize ) );

        self.setArrow( model, obj, v );
        self.arrows[obj].view.setVisible( true );
      }
    }
  } );
} );