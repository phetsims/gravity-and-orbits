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

  /**
   *
   * @param {IUserComponent} userComponent
   * @param {string} name
   * @param {number} x
   * @param {number} y
   * @param {number} diameter
   * @param {number} vx
   * @param {number} vy
   * @param {number} mass
   * @param {Color} color
   * @param {Color} highlight
   * @param {Function2<Body, Double, BodyRenderer>} renderer
   * @param {number} labelAngle
   * @param {boolean} massSettable
   * @param {number} maxPathLength
   * @param {boolean} massReadoutBelow
   * @param {number} tickValue
   * @param {string} tickLabel
   * @param {Property<boolean>} playButtonPressed
   * @param {Property<boolean>} stepping
   * @param {Property<boolean>} rewinding
   * @param {boolean} fixed
   * @constructor
   */
  function Body( userComponent, name, x, y, diameter, vx, vy, mass, color, highlight, renderer,// way to associate the graphical representation directly instead of later with conditional logic or map
                 labelAngle, massSettable, maxPathLength, massReadoutBelow, tickValue, tickLabel, playButtonPressed, stepping, rewinding, fixed ) {

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
    this.positionProperty = new RewindableProperty( playButtonPressed, stepping, rewinding, new Vector2( x, y ) );
    this.velocityProperty = new RewindableProperty( playButtonPressed, stepping, rewinding, new Vector2( vx, vy ) );
    this.massProperty = new RewindableProperty( playButtonPressed, stepping, rewinding, mass );
    this.collidedProperty = new RewindableProperty( playButtonPressed, stepping, rewinding, false );
    this.density = mass / getVolume();

    this.userControlled = false;//True if the user is currently controlling the position of the body with the mouse
    this.pathListeners = [];// ArrayList<PathListener>();
    this.path = [];//new ArrayList<Vector2D>();

    //list of listeners that are notified when the user drags the object, so that we know when certain properties need to be updated
    this.userModifiedPositionListeners = [];//new ArrayList<VoidFunction0>();

    collidedProperty.onValue( true, function() {
      clockTicksSinceExplosion.set( 0 );
    } );

    //If any of the rewind properties changes while the clock is paused, set a rewind point for all of them.

    //Relates to this problem reported by NP:
    //NP: odd behavior with rewind: Open sim and press play, let the planet move to directly left of the sun.
    //  Pause, then move the planet closer to sun. Press play, planet will move CCW. Then pause and hit rewind.
    //  Press play again, the planet will start to move in the opposite direction (CW).
    //SR: reproduced this in 0.0.14, perhaps the velocity is not being reset?
    var thisBody = this;
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
      return this.clockTicksSinceExplosion;
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
    getHightlight: function() {
      return this.highlight;
    },
    /**
     * @return {RewindableProperty<Vector2>}
     */
    getPositionProperty: function() {
      return positionProperty;
    },

    /**
     * @return {Vector2}
     */
    getPosition: function() {
      return positionProperty.get();
    },

    /**
     * @return {Property<Double> }
     */
    getDiameterProperty: function() {
      return diameterProperty;
    },

    /**
     * @return {number}
     */
    getDiameter: function() {
      return diameterProperty.get();
    },

    //TODO:
    //   Clients are required to call notifyUserModifiedPosition if this translation was done by the user.
    //   That's not at all clear (not documented here), it's error prone and it introduces order dependency.
    //   Recommend making notifyUserModifiedPosition private and adding another public variant of translate,
    //   i.e. public void translate(Point2D delta,boolean userModified) {...}

    /**
     * @param {Vector2} delta
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
      return this.positionProperty.get().getY();
    },

    /**
     * @return {number}
     */
    getX: function() {
      return this.positionProperty.get().getX();
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
    }

  } );
} );

//

//
//    //Take the updated BodyState from the physics engine and update the state of this body based on it.
//    public void updateBodyStateFromModel( BodyState bodyState ) {
//        if ( collidedProperty.get() ) {
//            clockTicksSinceExplosion.set( clockTicksSinceExplosion.get() + 1 );
//        }
//        else {
//            if ( !isUserControlled() ) {
//                positionProperty.set( bodyState.position );
//                velocityProperty.set( bodyState.velocity );
//            }
//            accelerationProperty.set( bodyState.acceleration );
//            forceProperty.set( bodyState.acceleration.times( bodyState.mass ) );
//        }
//    }
//
//    //This method is called after all bodies have been updated by the physics engine (must be done as a batch), so that the path can be updated
//    public void allBodiesUpdated() {
//        //Only add to the path if the user isn't dragging it
//        //But do add to the path even if the object is collided at the same location so the path will still grow in size and fade at the right time
//        if ( !isUserControlled() ) {
//            addPathPoint();
//        }
//    }
//
//    private void addPathPoint() {
//        while ( path.size() + 1//account for the point that will be added
//                > maxPathLength * GravityAndOrbitsModel.SMOOTHING_STEPS ) {//start removing data after 2 orbits of the default system
//            path.remove( 0 );
//            for ( PathListener listener : pathListeners ) {
//                listener.pointRemoved();
//            }
//        }
//        Vector2D pathPoint = getPosition();
//        path.add( pathPoint );
//        for ( PathListener listener : pathListeners ) {
//            listener.pointAdded( pathPoint );
//        }
//    }
//
//    public void clearPath() {
//        path.clear();
//        for ( PathListener listener : pathListeners ) {
//            listener.cleared();
//        }
//    }
//
//    public Property<Vector2D> getForceProperty() {
//        return forceProperty;
//    }
//
//    public void setMass( double mass ) {
//        massProperty.set( mass );
//        double radius = Math.pow( 3 * mass / 4 / Math.PI / density, 1.0 / 3.0 ); //derived from: density = mass/volume, and volume = 4/3 pi r r r
//        diameterProperty.set( radius * 2 );
//    }
//
//    public void resetAll() {
//        positionProperty.reset();
//        velocityProperty.reset();
//        accelerationProperty.reset();
//        forceProperty.reset();
//        massProperty.reset();
//        diameterProperty.reset();
//        collidedProperty.reset();
//        clockTicksSinceExplosion.reset();
//        clearPath();
//        //TODO: anything else to reset here?
//    }
//
//    public RewindableProperty<Vector2D> getVelocityProperty() {
//        return velocityProperty;
//    }
//
//    public RewindableProperty<Double> getMassProperty() {
//        return massProperty;
//    }
//
//    public boolean isUserControlled() {
//        return userControlled;
//    }
//
//    public void setUserControlled( boolean b ) {
//        this.userControlled = b;
//    }
//
//    public void addPathListener( PathListener listener ) {
//        pathListeners.add( listener );
//    }
//
//    public void setVelocity( Vector2D velocity ) {
//        velocityProperty.set( velocity );
//    }
//
//    public void setPosition( double x, double y ) {
//        positionProperty.set( new Vector2D( x, y ) );
//    }
//
//    public void setAcceleration( Vector2D acceleration ) {
//        this.accelerationProperty.set( acceleration );
//    }
//
//    public void setForce( Vector2D force ) {
//        this.forceProperty.set( force );
//    }
//
//    public boolean isMassSettable() {
//        return massSettable;
//    }
//
//    public BodyRenderer createRenderer( double viewDiameter ) {
//        return renderer.apply( this, viewDiameter );
//    }
//
//    public double getLabelAngle() {
//        return labelAngle;
//    }
//
//    public int getMaxPathLength() {
//        return maxPathLength * GravityAndOrbitsModel.SMOOTHING_STEPS;
//    }
//
//    public boolean isMassReadoutBelow() {
//        return massReadoutBelow;
//    }
//
//    public Property<Boolean> getCollidedProperty() {
//        return collidedProperty;
//    }
//
//    public boolean collidesWidth( Body body ) {
//        double distance = getPosition().minus( body.getPosition() ).magnitude();
//        double radiiSum = getDiameter() / 2 + body.getDiameter() / 2;
//        return distance < radiiSum;
//    }
//
//    public void setCollided( boolean b ) {
//        collidedProperty.set( b );
//    }
//
//    public double getTickValue() {
//        return tickValue;
//    }
//
//    public String getTickLabel() {
//        return tickLabel;
//    }
//
//    public void addUserModifiedPositionListener( VoidFunction0 listener ) {
//        userModifiedPositionListeners.add( listener );
//    }
//
//    public void notifyUserModifiedPosition() {
//        for ( VoidFunction0 listener : userModifiedPositionListeners ) {
//            listener.apply();
//        }
//    }
//
//    private ArrayList<VoidFunction0> userModifiedVelocityListeners = new ArrayList<VoidFunction0>();
//
//    public void addUserModifiedVelocityListener( VoidFunction0 listener ) {
//        userModifiedVelocityListeners.add( listener );
//    }
//
//    public void notifyUserModifiedVelocity() {
//        for ( VoidFunction0 listener : userModifiedVelocityListeners ) {
//            listener.apply();
//        }
//    }
//
//    public void rewind() {
//        positionProperty.rewind();
//        velocityProperty.rewind();
//        massProperty.rewind();
//        collidedProperty.rewind();
//        clearPath();
//    }
//
//    public Property<Boolean> anyPropertyDifferent() {
//        return new MultiwayOr( Arrays.asList( positionProperty.different(), velocityProperty.different(), massProperty.different(), collidedProperty.different() ) );
//    }
//
//    //Unexplodes and returns objects to the stage
//    public void returnBody( GravityAndOrbitsModel model ) {
//        if ( collidedProperty.get() || !bounds.get().contains( getPosition().toPoint2D() ) ) {
//            setCollided( false );
//            clearPath();//so there is no sudden jump in path from old to new location
//            doReturnBody( model );
//        }
//    }
//
//    //Returns the body, overriden by bodies that need to be returned near the current location of the body they orbit
//    protected void doReturnBody( GravityAndOrbitsModel model ) {
//        positionProperty.reset();
//        velocityProperty.reset();
//    }
//
//    public boolean isCollided() {
//        return collidedProperty.get();
//    }
//
//    public IUserComponent getUserComponent() {
//        return userComponent;
//    }
//
//    //Listener interface for getting callbacks when the path has changed, for displaying the path with picclo
//    public static interface PathListener {
//        public void pointAdded( Vector2D point );
//
//        public void pointRemoved();
//
//        public void cleared();
//    }
//
//    @Override
//    public String toString() {
//        return "name = " + getName() + ", mass = " + getMass();
//    }
//
//    public Property<Shape> getBounds() {
//        return bounds;
//    }
//}