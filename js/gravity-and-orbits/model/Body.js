//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Body is a single point mass in the Gravity and Orbits simulation, such as the Earth, Sun, Moon or Space Station.
 * This class also keeps track of body-related data such as the path.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RewindableProperty = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/RewindableProperty' );
  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsModel' );
  var BodyState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/BodyState' );

  /**
   *
   * @param {UserComponent} userComponent
   * @param {string} name
   * @param {number} x
   * @param {number} y
   * @param {number} diameter
   * @param {number} vx
   * @param {number} vy
   * @param {number} mass
   * @param {Color} color
   * @param {Color} highlight
   * @param {function<Body, number, BodyRenderer>} renderer
   * @param {number} labelAngle
   * @param {boolean} massSettable
   * @param {number} maxPathLength
   * @param {boolean} massReadoutBelow
   * @param {number} tickValue
   * @param {string} tickLabel
   * @param {Property<boolean>} playButtonPressedProperty
   * @param {Property<boolean>} steppingProperty
   * @param {Property<boolean>} rewindingProperty
   * @param {boolean} fixed
   * @constructor
   */
  function Body( userComponent, name, x, y, diameter, vx, vy, mass, color, highlight, renderer,// way to associate the graphical representation directly instead of later with conditional logic or map
                 labelAngle, massSettable, maxPathLength, massReadoutBelow, tickValue, tickLabel, playButtonPressedProperty, steppingProperty, rewindingProperty, fixed ) {

    PropertySet.call( this, {
      acceleration: new Vector2(),
      force: new Vector2(),
      diameter: diameter, // number
      clockTicksSinceExplosion: 0,
      bounds: new Rectangle( 0, 0, 0, 0 ) //if the object leaves these model bounds, then it can be "returned" using a return button on the canvas
    } );

    this.userComponent = userComponent;//sun is immobile in cartoon mode
    this.massSettable = massSettable;
    this.maxPathLength = maxPathLength; //Number of samples in the path before it starts erasing (fading out from the back)

    //True if the mass readout should appear below the body (so that readouts don't overlap too much),
    // in the model for convenience since the body type determines where the mass readout should appear
    this.massReadoutBelow = massReadoutBelow;
    this.tickValue = tickValue; //value that this body's mass should be identified with, for 'planet' this will be the earth's mass
    this.tickLabel = tickLabel; //name associated with this body when it takes on the tickValue above, for 'planet' this will be "earth"
    this.fixed = fixed; //true if the object doesn't move when the physics engine runs, (though still can be moved by the user's mouse)
    assert && assert( renderer != null );
    this.name = name;
    this.color = color;
    this.highlight = highlight;
    this.renderer = renderer; //function that creates a PNode for this Body.

    // This is in the model so we can associate the graphical representation directly instead of later with conditional logic or map
    this.labelAngle = labelAngle;
    this.positionProperty = new RewindableProperty( playButtonPressedProperty, steppingProperty, rewindingProperty, new Vector2( x, y ) );
    this.velocityProperty = new RewindableProperty( playButtonPressedProperty, steppingProperty, rewindingProperty, new Vector2( vx, vy ) );
    this.massProperty = new RewindableProperty( playButtonPressedProperty, steppingProperty, rewindingProperty, mass );
    this.collidedProperty = new RewindableProperty( playButtonPressedProperty, steppingProperty, rewindingProperty, false );
    this.density = mass / this.getVolume();

    this.userControlled = false;//True if the user is currently controlling the position of the body with the mouse
    this.pathListeners = [];// ArrayList<PathListener>();
    this.path = [];//new ArrayList<Vector2>();

    //list of listeners that are notified when the user drags the object, so that we know when certain properties need to be updated
    this.userModifiedPositionListeners = [];
    this.userModifiedVelocityListeners = [];

    var thisBody = this;
    this.collidedProperty.onValue( true, function() {
      thisBody.clockTicksSinceExplosionProperty.set( 0 );
    } );

    //If any of the rewind properties changes while the clock is paused, set a rewind point for all of them.

    //Relates to this problem reported by NP:
    //NP: odd behavior with rewind: Open sim and press play, let the planet move to directly left of the sun.
    //  Pause, then move the planet closer to sun. Press play, planet will move CCW. Then pause and hit rewind.
    //  Press play again, the planet will start to move in the opposite direction (CW).
    //SR: reproduced this in 0.0.14, perhaps the velocity is not being reset?
    var rewindValueChangeListener = function() {
      thisBody.positionProperty.storeRewindValueNoNotify();
      thisBody.velocityProperty.storeRewindValueNoNotify();
      thisBody.massProperty.storeRewindValueNoNotify();
      thisBody.collidedProperty.storeRewindValueNoNotify();
    };
    this.positionProperty.addRewindValueChangeListener( rewindValueChangeListener );
    this.velocityProperty.addRewindValueChangeListener( rewindValueChangeListener );
    this.massProperty.addRewindValueChangeListener( rewindValueChangeListener );
    this.collidedProperty.addRewindValueChangeListener( rewindValueChangeListener );
  }

  return inherit( PropertySet, Body, {

    /**
     * @return {Property<number>}
     */
    getClockTicksSinceExplosion: function() {
      return this.clockTicksSinceExplosionProperty;
    },

    /**
     * @return {number}
     */
    getVolume: function() {
      return 4.0 / 3.0 * Math.PI * Math.pow( this.getRadius(), 3 );
    },

    /**
     * @return {number}
     */
    getRadius: function() {
      return this.getDiameter() / 2;
    },

    /**
     * @return {Color}
     */
    getColor: function() {
      return this.color;
    },

    /**
     * @return {Color}
     */
    getHighlight: function() {
      return this.highlight;
    },

    /**
     * @return {RewindableProperty<Vector2>}
     */
    getPositionProperty: function() {
      return this.positionProperty;
    },

    /**
     * @return {Vector2}
     */
    getPosition: function() {
      return this.positionProperty.get();
    },

    /**
     * @return {Property<Double> }
     */
    getDiameterProperty: function() {
      return this.diameterProperty;
    },

    /**
     * @return {number}
     */
    getDiameter: function() {
      return this.diameterProperty.get();
    },

    //TODO:
    //   Clients are required to call notifyUserModifiedPosition if this translation was done by the user.
    //   That's not at all clear (not documented here), it's error prone and it introduces order dependency.
    //   Recommend making notifyUserModifiedPosition private and adding another public variant of translate,
    //   i.e. public void translate(Point2D delta,boolean userModified) {...}
    /**
     * @param {Vector2} dx
     * @param {Vector2} dy
     */
    translate: function( dx, dy ) {
      if ( dx instanceof Vector2 ) {
        dx = dx.x;
        dy = dx.y;
      }
      this.positionProperty.set( new Vector2( this.getX() + dx, this.getY() + dy ) );

      //Only add to the path if the object hasn't collided
      //NOTE: this check was not originally in the 2 param translate method
      if ( !this.collidedProperty.get() && !this.userControlled ) {
        this.addPathPoint();
      }
    },

    /**
     * @return {number}
     */
    getY: function() {
      return this.positionProperty.get().y;
    },

    /**
     * @return {number}
     */
    getX: function() {
      return this.positionProperty.get().x;
    },

    /**
     * @return {string}
     */
    getName: function() {
      return this.name;
    },

    /**
     * @param {number} value
     */
    setDiameter: function( value ) {
      this.diameterProperty.set( value );
    },

    /**
     * create an immutable representation of this body for use in the physics engine
     *
     * @return {BodyState}
     */
    toBodyState: function() {
      return new BodyState( this.getPosition(), this.getVelocity(), this.getAcceleration(), this.getMass(), this.collidedProperty.get() );
    },

    /**
     * @return {number}
     */
    getMass: function() {
      return this.massProperty.get();
    },

    /**
     * @return {Vector2}
     */
    getAcceleration: function() {
      return this.accelerationProperty.get();
    },

    /**
     * @return {Vector2}
     */
    getVelocity: function() {
      return this.velocityProperty.get();
    },

    /**
     * @return {number}
     */
    getTickValue: function() {
      return this.tickValue;
    },

    /**
     * Take the updated BodyState from the physics engine and update the state of this body based on it.
     *
     * @param {BodyState} bodyState
     */
    updateBodyStateFromModel: function( bodyState ) {
      if ( this.collidedProperty.get() ) {
        this.clockTicksSinceExplosionProperty.value += 1;
      }
      else {
        if ( !this.isUserControlled() ) {
          this.positionProperty.set( bodyState.position );
          this.velocityProperty.set( bodyState.velocity );
        }
        this.accelerationProperty.set( bodyState.acceleration );
        this.forceProperty.set( bodyState.acceleration.times( bodyState.mass ) );
      }
    },

    // This method is called after all bodies have been updated by the physics engine (must be done as a batch),
    // so that the path can be updated
    allBodiesUpdated: function() {
      //Only add to the path if the user isn't dragging it
      //But do add to the path even if the object is collided at the same location so the path will still grow in size and fade at the right time
      if ( !this.isUserControlled() ) {
        this.addPathPoint();
      }
    },

    addPathPoint: function() {
      var i;
      while ( this.path.length + 1//account for the point that will be added
        > this.maxPathLength * GravityAndOrbitsModel.SMOOTHING_STEPS ) {//start removing data after 2 orbits of the default system
//        this.path.remove( 0 );
        this.path.shift();

        for ( i = 0; i < this.pathListeners.length; i++ ) {
          this.pathListeners[i].pointRemoved();
        }
      }
      var pathPoint = this.getPosition();
      this.path.push( pathPoint );

      for ( i = 0; i < this.pathListeners.length; i++ ) {
        this.pathListeners[i].pointAdded( pathPoint );
      }
    },

    clearPath: function() {
//      this.path.clear();
      this.path = [];
      for ( var i = 0; i < this.pathListeners.length; i++ ) {
        this.pathListeners[i].cleared();
      }
    },

    /**
     * @return {Property<Vector2>}
     */
    getForceProperty: function() {
      return this.forceProperty;
    },

    /**
     * @param mass
     */
    setMass: function( mass ) {
      this.massProperty.set( mass );
      var radius = Math.pow( 3 * mass / 4 / Math.PI / this.density, 1.0 / 3.0 ); //derived from: density = mass/volume, and volume = 4/3 pi r r r
      this.diameterProperty.set( radius * 2 );
    },

    resetAll: function() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
      this.accelerationProperty.reset();
      this.forceProperty.reset();
      this.massProperty.reset();
      this.diameterProperty.reset();
      this.collidedProperty.reset();
      this.clockTicksSinceExplosionProperty.reset();
      this.clearPath();
      //TODO: anything else to reset here?
    },

    /**
     * @return {RewindableProperty<Vector2>}
     */
    getVelocityProperty: function() {
      return this.velocityProperty;
    },

    /**
     * @return {RewindableProperty<number>}
     */
    getMassProperty: function() {
      return this.massProperty;
    },

    /**
     * @return {boolean}
     */
    isUserControlled: function() {
      return this.userControlled;
    },

    /**
     * @param {boolean} b
     */
    setUserControlled: function( b ) {
      this.userControlled = b;
    },

    /**
     * Add a listener for getting callbacks when the path has changed, for displaying the path with picclo
     * TODO: Should this be rewritten using trigger?
     * @param {PathListener} listener
     */
    addPathListener: function( listener ) {

      //assert that it has all the right parts
      assert && assert( listener.pointAdded && listener.pointRemoved && listener.cleared );

      this.pathListeners.push( listener );
    },

    /**
     * @param {Vector2} velocity
     */
    setVelocity: function( velocity ) {
      this.velocityProperty.set( velocity );
    },

    /**
     * @param {number} x
     * @param {number} y
     */
    setPosition: function( x, y ) {
      this.positionProperty.set( new Vector2( x, y ) );
    },

    /**
     * @param {Vector2} acceleration
     */
    setAcceleration: function( acceleration ) {
      this.accelerationProperty.set( acceleration );
    },

    /**
     * @param {Vector2} force
     */
    setForce: function( force ) {
      this.forceProperty.set( force );
    },

    /**
     * @return {boolean}
     */
    isMassSettable: function() {
      return this.massSettable;
    },

    /**
     * @return {BodyRenderer}
     */
    createRenderer: function( viewDiameter ) {
      return this.renderer( this, viewDiameter );
    },

    /**
     * @return {number}
     */
    getLabelAngle: function() {
      return this.labelAngle;
    },

    /**
     * @return {number}
     */
    getMaxPathLength: function() {
      return this.maxPathLength * GravityAndOrbitsModel.SMOOTHING_STEPS;
    },

    /**
     * @return {boolean}
     */
    isMassReadoutBelow: function() {
      return this.massReadoutBelow;
    },

    /**
     * @return {Property<boolean>}
     */
    getCollidedProperty: function() {
      return this.collidedProperty;
    },

    /**
     * @param {Body} body
     * @return {boolean}
     */
    collidesWidth: function( body ) {
      var distance = this.getPosition().minus( body.getPosition() ).magnitude();
      var radiiSum = this.getDiameter() / 2 + body.getDiameter() / 2;
      return distance < radiiSum;
    },

    /**
     * @param {boolean} b
     */
    setCollided: function( b ) {
      this.collidedProperty.set( b );
    },

    /**
     * @return {string}
     */
    getTickLabel: function() {
      return this.tickLabel;
    },

    /**
     * @param {function} listener
     */
    addUserModifiedPositionListener: function( listener ) {
      this.userModifiedPositionListeners.push( listener );
    },

    notifyUserModifiedPosition: function() {
      for ( var i = 0; i < this.userModifiedPositionListeners.length; i++ ) {
        this.userModifiedPositionListeners[i].call( this );
      }
    },

    /**
     * @param {function} listener
     */
    addUserModifiedVelocityListener: function( listener ) {
      this.userModifiedVelocityListeners.push( listener );
    },

    notifyUserModifiedVelocity: function() {
      for ( var i = 0; i < this.userModifiedVelocityListeners.length; i++ ) {
        this.userModifiedVelocityListeners[i].call( this );
      }
    },

    rewind: function() {
      this.positionProperty.rewind();
      this.velocityProperty.rewind();
      this.massProperty.rewind();
      this.collidedProperty.rewind();
      this.clearPath();
    },

    /**
     * @returns {MultiwayOr}
     */
    anyPropertyDifferent: function() {
      return new MultiwayOr( Arrays.asList( this.positionProperty.different(), this.velocityProperty.different(), this.massProperty.different(), this.collidedProperty.different() ) );
    },

    /**
     * Unexplodes and returns objects to the stage
     *
     * @param {GravityAndOrbitsModel} model
     */
    returnBody: function( model ) {
      if ( this.collidedProperty.get() || !bounds.get().contains( this.getPosition() ) ) {
        this.setCollided( false );
        this.clearPath();//so there is no sudden jump in path from old to new location
        this.doReturnBody( model );
      }
    },

    /**
     * Unexplodes and returns objects to the stage
     *
     * @param {GravityAndOrbitsModel} model (why is the model passed here? was ported from the Java, should probably be removed)
     */
    doReturnBody: function( model ) {
      this.positionProperty.reset();
      this.velocityProperty.reset();
    },

    /**
     * @return {boolean}
     */
    isCollided: function() {
      return this.collidedProperty.get();
    },

    /**
     * @return {UserComponent}
     */
    getUserComponent: function() {
      return this.userComponent;
    },

    /**
     * @return {string}
     */
    toString: function() {
      return "name = " + this.getName() + ", mass = " + this.getMass();
    },

    /**
     * @return {Property<Rectangle>}
     */
    getBounds: function() {
      return this.bounds;
    }

  } );
} );