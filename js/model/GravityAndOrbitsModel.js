// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Vector2 = require( 'DOT/Vector2' );

  var CONSTANTS = {
    G: 6.67384E-11, // gravitational constant
    SUN_RADIUS: 6.955E8,
    SUN_MASS: 1.989E30,
    EARTH_RADIUS: 6.371E6,
    EARTH_MASS: 5.9736E24,
    EARTH_PERIHELION: 147098290E3,
    EARTH_ORBITAL_SPEED_AT_PERIHELION: 30300,
    MOON_MASS: 7.3477E22,
    MOON_RADIUS: 1737.1E3,
    MOON_EARTH_SPEED: -1.01E3,
    MOON_SPEED: -1.01E3,
    MOON_PERIGEE: 391370E3,
    MOON_X: 147098290E3,
    MOON_Y: 391370E3,
    SPACE_STATION_RADIUS: 109,
    SPACE_STATION_MASS: 369914,
    SPACE_STATION_SPEED: 7706,
    SPACE_STATION_PERIGEE: 347000
  };

  var planetModes = [
    {
      sun: {
        fixed: true,
        x: 0,
        y: 0,
        radius: CONSTANTS.SUN_RADIUS * 50,
        mass: CONSTANTS.SUN_MASS
      },
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 800,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS * 10200
      },
      options: {
        forceScale: 1.017,
        timeScale: 365.0 / 26.0, // 365 day in 26 sec
        scale: 1.75E-9,
        centerX: 250,
        centerY: 300
      }
    },
    {
      sun: {
        fixed: true,
        x: 0,
        y: 0,
        radius: CONSTANTS.SUN_RADIUS * 50,
        mass: CONSTANTS.SUN_MASS
      },
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 800,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS * 10200
      },
      moon: {
        x: CONSTANTS.MOON_X,
        y: -CONSTANTS.EARTH_RADIUS * 800 * 1.7,
        radius: CONSTANTS.MOON_RADIUS * 800,
        velocity: {x: CONSTANTS.MOON_SPEED * 21, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.MOON_MASS
      },
      options: {
        forceScale: 1.017,
        timeScale: 365.0 / 26.0,
        scale: 1.75E-9,
        centerX: 250,
        centerY: 300
      }
    },
    {
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 15,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS
      },
      moon: {
        x: CONSTANTS.MOON_X,
        y: -CONSTANTS.MOON_Y,
        radius: CONSTANTS.MOON_RADIUS * 15,
        velocity: {x: CONSTANTS.MOON_SPEED, y: 0},
        mass: CONSTANTS.MOON_MASS
      },
      options: {
        forceScale: 0.77 * 45,
        timeScale: 365.0 / 25.5,
        scale: 1E-6,
        centerX: 147098 + 200,
        centerY: 200
      }
    },
    {
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 0.8 / 500,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS
      },
      spaceStation: {
        x: CONSTANTS.SPACE_STATION_PERIGEE + CONSTANTS.EARTH_RADIUS + CONSTANTS.SPACE_STATION_RADIUS,
        y: 0,
        radius: CONSTANTS.SPACE_STATION_RADIUS * 8,
        velocity: {x: 0, y: -CONSTANTS.SPACE_STATION_SPEED},
        mass: CONSTANTS.SPACE_STATION_MASS
      },
      options: {
        forceScale: 3E13,
        timeScale: 365.0 / 25.5,
        scale: 1E-2,
        centerX: 200,
        centerY: 200
      }
    }
  ];

  var fps = 60;

  function GravityAndOrbitsModel( width, height ) {
    var self = this;
    this.viewModes = ['cartoon', 'scale'];

    this.spaceObjects = ['sun', 'earth', 'moon', 'spaceStation'];
    this.spaceObjectsProps = [
      {name: 'View', value: new Node()},
      {name: 'Mass', value: 1},
      {name: 'MassCoeff', value: 1},
      {name: 'Radius', value: 1},
      {name: 'RadiusCoeff', value: 1},
      {name: 'Exploded', value: false},
      {name: 'Velocity', type: 'vector', value: { x: 0, y: 0}},
      {name: 'VelocityHalf', type: 'vector', value: { x: 0, y: 0}},
      {name: 'Acceleration', type: 'vector', value: { x: 0, y: 0}},
      {name: 'PositionStart', type: 'vector', value: { x: 0, y: 0}},
      {name: 'Position', type: 'vector', value: { x: 0, y: 0}}
    ];

    // possible planet modes
    this.planetModes = planetModes;

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      viewMode: this.viewModes[0], // 'cartoon', 'scale'
      planetMode: 0, // which planet showing
      gravity: true, // switch gravity
      forceArrow: false, // visible force arrows
      velocityArrow: false, // visible velocity arrows
      path: false, // visible path
      grid: false, // visible grid
      tape: false, // visible tape
      mass: false, // visible mass
      play: false, // play/pause state
      rightPanelHeight: 0, // height of right control panel
      speed: 1, // 1.75, 1, 0.25
      day: 0,
      scale: 1,
      scaleCenter: new Vector2( 0, 0 )
    } );

    // add property for space objects
    PropertySet.call( this, getSpaceObjectProperties.call( this ) );

    // update view for every new time tick
    this.dayProperty.link( function( newDay, prevDay ) {
      updateView.call( self, newDay - prevDay );
    } );

    // add observers for mass sliders
    this.spaceObjects.forEach( function( el ) {
      self[el + 'MassCoeffProperty'].link( function( newValue, oldValue ) {
        self[el + 'Mass'] *= 1 / (oldValue || 1);
        self[el + 'Mass'] *= newValue;

        // change radius
        self[el + 'RadiusCoeff'] = Math.pow( newValue, 1 / 3 );
      } );

      self[el + 'RadiusCoeffProperty'].link( function( newValue, oldValue ) {
        self[el + 'View'].scale( 1 / (oldValue || 1) );
        self[el + 'View'].scale( newValue );
      } );
    } );

    this.reset();
  }

  inherit( PropertySet, GravityAndOrbitsModel, {
    step: function( dt ) {
      if ( this.play ) {
        this.stepManual( dt );
      }
    },
    reset: function() {
      this.planetModeProperty.reset();
      this.gravityProperty.reset();
      this.forceArrowProperty.reset();
      this.velocityArrowProperty.reset();
      this.pathProperty.reset();
      this.gridProperty.reset();
      this.tapeProperty.reset();
      this.massProperty.reset();
      this.playProperty.reset();
      this.speedProperty.reset();
      this.dayProperty.reset();
      this.scaleProperty.reset();

      // reset property for space objects
      for ( var i = 0, j; i < this.spaceObjects.length; i++ ) {
        for ( j = 0; j < this.spaceObjectsProps.length; j++ ) {
          this[this.spaceObjects[i] + this.spaceObjectsProps[j].name + 'Property'].reset();
        }
      }
    },
    clear: function() {
      this.dayProperty.reset();
    },
    stepManual: function( dt ) {
      dt = dt || 1 / fps;
      this.day += dt * this.speed * this.planetModes[this.planetMode].options.timeScale;
    }
  } );

  var updateView = function( t ) {
    var model = this,
      mode = model.planetModes[model.planetMode],
      scale = mode.options.scale,
      forceScale = mode.options.forceScale,
      timeScale = 24 * 60 * 60 * 0.967,
      STEPS = 10,
      dt = t * timeScale / STEPS,
    //dx = {},
      i,
      currentObj;

    /*for ( i = 0; i < model.spaceObjects.length; i++ ) {
     dx[model.spaceObjects[i]] = new Vector2( 0, 0 );
     }*/

    for ( var j = 0; j < STEPS; j++ ) {
      for ( i = 0; i < model.spaceObjects.length; i++ ) {
        currentObj = model.spaceObjects[i];

        // change position of not fixed objects
        if ( mode[currentObj] && !mode[currentObj].fixed ) {
          //dx[currentObj] = dx[currentObj].plus( model[currentObj + 'Velocity'].timesScalar( dt ).plus( model[currentObj + 'Acceleration'].timesScalar( dt * dt / 2 ) ) );
          model[currentObj + 'Position'] = model[currentObj + 'Position'].timesScalar( 1.0 / scale ).plus( model[currentObj + 'Velocity'].timesScalar( dt ).plus( model[currentObj + 'Acceleration'].timesScalar( dt * dt / 2.0 ) ) ).timesScalar( scale );
          model[currentObj + 'VelocityHalf'] = model[currentObj + 'Velocity'].plus( model[currentObj + 'Acceleration'].timesScalar( dt / 2.0 ) );
          model[currentObj + 'Acceleration'] = getForce.call( model, currentObj ).timesScalar( -forceScale / model[currentObj + 'Mass'] );
          model[currentObj + 'Velocity'] = model[currentObj + 'VelocityHalf'].plus( model[currentObj + 'Acceleration'].timesScalar( dt / 2.0 ) );
        }
      }
    }

    /*for ( i = 0; i < model.spaceObjects.length; i++ ) {
     currentObj = model.spaceObjects[i];
     if ( mode[currentObj] && !mode[currentObj].fixed ) {
     model[currentObj + 'Position'] = model[currentObj + 'Position'].timesScalar( 1 / scale ).plus( dx[currentObj] ).timesScalar( scale );
     }
     }*/
  };

  var getForce = function( target ) {
    var F = new Vector2( 0, 0 ), currentObj, model = this, mode = model.planetModes[model.planetMode], scale = mode.options.scale, targetPos = model[target + 'Position'].timesScalar( 1 / scale ) , sourcePos;

    // zero vector, for no gravity
    if ( model.gravity ) {
      for ( var i = 0; i < model.spaceObjects.length; i++ ) {
        currentObj = model.spaceObjects[i];
        sourcePos = model[currentObj + 'Position'].timesScalar( 1 / scale );

        // ignore computation if that body has exploded,
        // or if they are on top of each other, force should be infinite, but ignore it since we want to have semi-realistic behavior
        if ( mode[currentObj] && currentObj !== target && !model[currentObj + 'Exploded'] && !targetPos.equals( sourcePos ) ) {
          F = F.plus( getUnitVector( sourcePos, targetPos ).timesScalar( CONSTANTS.G * model[currentObj + 'Mass'] * model[target + 'Mass'] / (targetPos.distanceSquared( sourcePos )) ) );
        }
      }
    }
    return F;
  };

  var getUnitVector = function( source, target ) {
    return target.minus( source ).normalized();
  };

  var getSpaceObjectProperties = function() {
    for ( var i = 0, props = {}, j; i < this.spaceObjects.length; i++ ) {
      for ( j = 0; j < this.spaceObjectsProps.length; j++ ) {
        if ( this.spaceObjectsProps[j].type === 'vector' ) {
          props[this.spaceObjects[i] + this.spaceObjectsProps[j].name] = new Vector2( this.spaceObjectsProps[j].value.x, this.spaceObjectsProps[j].value.y );
        }
        else {
          props[this.spaceObjects[i] + this.spaceObjectsProps[j].name] = this.spaceObjectsProps[j].value;
        }
      }
    }
    return props;
  };

  return GravityAndOrbitsModel;
} );
