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

  var fps = 60, timeModes = ['days', 'minutes'];

  var planetModes = [
    {
      sun: {
        fixed: true,
        x: 0,
        y: 0,
        radius: CONSTANTS.SUN_RADIUS * 50,
        radiusScaleMode: 0.025,
        mass: CONSTANTS.SUN_MASS
      },
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 800,
        radiusScaleMode: 0.05,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS * 10200
      },
      options: {
        forceScale: 1.017, // ratio of the gravitational and centripetal forces
        timeScale: 365.0 / 26.0, // days per seconds
        timeMode: timeModes[0],
        scale: 1.5E-9,
        centerX: 245,
        centerY: 275
      }
    },
    {
      sun: {
        fixed: true,
        x: 0,
        y: 0,
        radius: CONSTANTS.SUN_RADIUS * 50,
        radiusScaleMode: 0.025,
        mass: CONSTANTS.SUN_MASS
      },
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 800,
        radiusScaleMode: 0.05,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS * 10200
      },
      moon: {
        x: CONSTANTS.MOON_X,
        y: -CONSTANTS.EARTH_RADIUS * 800 * 1.7,
        radius: CONSTANTS.MOON_RADIUS * 800,
        radiusScaleMode: 0.05,
        velocity: {x: CONSTANTS.MOON_SPEED * 21, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.MOON_MASS
      },
      options: {
        forceScale: 1.017, // ratio of the gravitational and centripetal forces
        timeScale: 365.0 / 26.0, // days per seconds
        timeMode: timeModes[0],
        scale: 1.5E-9,
        centerX: 245,
        centerY: 275
      }
    },
    {
      earth: {
        x: 0,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 15,
        radiusScaleMode: 0.05,
        velocity: {x: -CONSTANTS.MOON_SPEED * CONSTANTS.MOON_MASS / CONSTANTS.EARTH_MASS, y: 0}, // -vx for fulfill the law of conservation of momentum
        mass: CONSTANTS.EARTH_MASS
      },
      moon: {
        x: 0,
        y: -CONSTANTS.MOON_Y,
        radius: CONSTANTS.MOON_RADIUS * 15,
        radiusScaleMode: 0.05,
        velocity: {x: CONSTANTS.MOON_SPEED, y: 0},
        mass: CONSTANTS.MOON_MASS
      },
      options: {
        forceScale: 1.001,
        timeScale: 365.0 / 96.0, // days per seconds
        timeMode: timeModes[0],
        scale: 5E-7,
        centerX: 245,
        centerY: 280
      }
    },
    {
      earth: {
        x: 0,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 0.8,
        radiusScaleMode: 1.27,
        velocity: {x: 0, y: 0},
        mass: CONSTANTS.EARTH_MASS
      },
      spaceStation: {
        x: CONSTANTS.SPACE_STATION_PERIGEE + CONSTANTS.EARTH_RADIUS + CONSTANTS.SPACE_STATION_RADIUS,
        y: 0,
        radius: CONSTANTS.SPACE_STATION_RADIUS * 8000,
        radiusScaleMode: 0.1,
        velocity: {x: 0, y: -CONSTANTS.SPACE_STATION_SPEED},
        mass: CONSTANTS.SPACE_STATION_MASS
      },
      options: {
        forceScale: 1,
        timeScale: 365.0 / 31855.0, // days per seconds
        timeMode: timeModes[1],
        scale: 2.6E-5,
        centerX: 270,
        centerY: 230
      }
    }
  ];

  function GravityAndOrbitsModel( width, height ) {
    var self = this;
    this.viewModes = ['cartoon', 'scale'];
    this.timeModes = timeModes;

    this.spaceObjects = ['sun', 'earth', 'moon', 'spaceStation'];
    this.spaceObjectsProps = [
      {name: 'View', value: new Node()},
      {name: 'Tooltip', value: new Node()},
      {name: 'Mass', value: 1},
      {name: 'MassCoeff', value: 1},
      {name: 'Radius', value: 0},
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
      planetMode: 0, // planet mode
      timeMode: timeModes[0], // time counter format
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
      drag: '',
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

    this.spaceObjects.forEach( function( el ) {
      // add observers for mass sliders
      self[el + 'MassCoeffProperty'].link( function( newValue, oldValue ) {
        self[el + 'Mass'] *= 1 / (oldValue || 1);
        self[el + 'Mass'] *= newValue;

        // change radius
        self[el + 'RadiusCoeff'] = Math.pow( newValue, 1 / 3 );
      } );

      // resize view if radius changed
      self[el + 'RadiusCoeffProperty'].link( function( newValue, oldValue ) {
        self[el + 'View'].scale( 1 / (oldValue || 1) );
        self[el + 'View'].scale( newValue );
      } );

      // hide view if it was exploded
      self[el + 'ExplodedProperty'].link( function( exploded ) {
        self[el + 'View'].setVisible( !exploded );
      } );

      self[el + 'RadiusCoeffProperty'].link( function() {
        checkExplosion( self );
      } );

      self[el + 'PositionProperty'].link( function() {
        checkExplosion( self );
      } );
    } );

    // force planet mode reset function
    this.planetModeReset = function() {
      self.planetMode += ( (self.planetMode === (self.planetModes.length - 1)) ? -1 : 1);
      self.planetModeProperty.reset();
    };

    this.reset();
  }

  inherit( PropertySet, GravityAndOrbitsModel, {
    step: function( dt ) {
      if ( this.play ) {
        this.stepManual( dt );
      }
    },
    reset: function() {
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
      this.planetModeReset();
    },
    clear: function() {
      this.dayProperty.reset();
      this.planetModeReset();
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
      i,
      currentObj;

    for ( var j = 0; j < STEPS; j++ ) {
      for ( i = 0; i < model.spaceObjects.length; i++ ) {
        currentObj = model.spaceObjects[i];

        // change position of not fixed or dragging objects
        if ( mode[currentObj] && !mode[currentObj].fixed && currentObj !== model.drag ) {
          model[currentObj + 'Position'] = model[currentObj + 'Position'].timesScalar( 1.0 / scale ).plus( model[currentObj + 'Velocity'].timesScalar( dt ).plus( model[currentObj + 'Acceleration'].timesScalar( dt * dt / 2.0 ) ) ).timesScalar( scale );
          model[currentObj + 'VelocityHalf'] = model[currentObj + 'Velocity'].plus( model[currentObj + 'Acceleration'].timesScalar( dt / 2.0 ) );
          model[currentObj + 'Acceleration'] = getForce.call( model, currentObj ).timesScalar( -forceScale / model[currentObj + 'Mass'] );
          model[currentObj + 'Velocity'] = model[currentObj + 'VelocityHalf'].plus( model[currentObj + 'Acceleration'].timesScalar( dt / 2.0 ) );
        }
      }
    }
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

  var checkExplosion = function( model ) {
    var obj1, obj2, i, j, dx, dr, mode = model.planetModes[model.planetMode];

    for ( i = 0; i < model.spaceObjects.length; i++ ) {
      obj1 = model.spaceObjects[i];
      if ( !mode[obj1] ) {continue;}
      for ( j = i + 1; j < model.spaceObjects.length; j++ ) {
        obj2 = model.spaceObjects[j];
        if ( !mode[obj2] ) {continue;}
        dx = model[obj1 + 'Position'].minus( model[obj2 + 'Position'] ).magnitude(); // distance between planets
        dr = (model[obj1 + 'View'].getWidth() + model[obj2 + 'View'].getWidth()) / 2;
        if ( !isFinite( dx ) || !isFinite( dr ) ) {
          {continue;}
        }
        if ( dr > dx ) {
          model[(model[obj1 + 'Mass'] > model[obj2 + 'Mass'] ? obj2 : obj1 ) + 'Exploded'] = true;
        }
      }
    }
  };

  return GravityAndOrbitsModel;
} );
