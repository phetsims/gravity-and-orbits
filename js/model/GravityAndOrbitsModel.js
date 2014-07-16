// Copyright 2002-2013, University of Colorado Boulder

/**
 * The main model for Gravity and Orbits, which contains the physics and the model representation of the bodies.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SpaceObjectModel = require( 'model/SpaceObjectModel' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var thousandEarthMassesString = require( 'string!GRAVITY_AND_ORBITS/thousandEarthMasses' );
  var earthMassesString = require( 'string!GRAVITY_AND_ORBITS/earthMasses' );
  var billionBillionSatelliteMassesString = require( 'string!GRAVITY_AND_ORBITS/billionBillionSatelliteMasses' );
  var satelliteMassesString = require( 'string!GRAVITY_AND_ORBITS/satelliteMasses' );
  var cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
  var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );

  // constants
  var CONSTANTS = {

      // All constants are in MKS (metric) units: meters, kg, seconds
      G: 6.67384E-11,  // gravitational constant
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
      SPACE_STATION_PERIGEE: 347000,
      METERS_PER_MILE: 0.000621371192
    },
    timeModes = ['days', 'minutes'],
    planetModes = [
      {
        sun: {
          fixed: true,
          x: 0,
          y: 0,
          radius: CONSTANTS.SUN_RADIUS * 50,
          radiusScaleMode: 0.025,
          mass: CONSTANTS.SUN_MASS,
          massLabel: {
            defaultValue: 333,
            text: thousandEarthMassesString
          }
        },
        earth: {
          x: CONSTANTS.EARTH_PERIHELION,
          y: 0,
          radius: CONSTANTS.EARTH_RADIUS * 800,
          radiusScaleMode: 0.15,
          velocity: new Vector2( 0, -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION ),
          mass: CONSTANTS.EARTH_MASS * 10200,
          massLabel: {
            defaultValue: 1,
            text: earthMassesString,
            precision: 2
          }
        },
        options: {
          forceScale: 1.017, // ratio of the gravitational and centripetal forces
          timeScale: 365.0 / 26.0, // days per seconds
          timeMode: timeModes[0],
          scale: 1.15E-9,
          centerX: 275,
          centerY: 235
        }
      },
      {
        sun: {
          fixed: true,
          x: 0,
          y: 0,
          radius: CONSTANTS.SUN_RADIUS * 50,
          radiusScaleMode: 0.025,
          mass: CONSTANTS.SUN_MASS,
          massLabel: {
            defaultValue: 333,
            text: thousandEarthMassesString
          }
        },
        earth: {
          x: CONSTANTS.EARTH_PERIHELION,
          y: 0,
          radius: CONSTANTS.EARTH_RADIUS * 800,
          radiusScaleMode: 0.15,
          velocity: new Vector2( 0, -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION ),
          mass: CONSTANTS.EARTH_MASS * 10200,
          massLabel: {
            defaultValue: 1,
            text: earthMassesString,
            precision: 2
          }
        },
        moon: {
          x: CONSTANTS.MOON_X,
          y: -CONSTANTS.EARTH_RADIUS * 800 * 1.7,
          radius: CONSTANTS.MOON_RADIUS * 800,
          radiusScaleMode: 0.3,
          velocity: new Vector2( CONSTANTS.MOON_SPEED * 21, -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION ),
          mass: CONSTANTS.MOON_MASS,
          massLabel: {
            defaultValue: 0.01,
            text: earthMassesString,
            precision: 2
          }
        },
        options: {
          forceScale: 1.017, // ratio of the gravitational and centripetal forces
          timeScale: 365.0 / 26.0, // days per seconds
          timeMode: timeModes[0],
          scale: 1.15E-9,
          centerX: 275,
          centerY: 235
        }
      },
      {
        earth: {
          x: 0,
          y: 0,
          radius: CONSTANTS.EARTH_RADIUS * 15,
          radiusScaleMode: 0.05,
          velocity: new Vector2( -CONSTANTS.MOON_SPEED * CONSTANTS.MOON_MASS / CONSTANTS.EARTH_MASS, 0 ), // -vx to fulfill the law of conservation of momentum
          mass: CONSTANTS.EARTH_MASS,
          massLabel: {
            defaultValue: 1,
            text: earthMassesString,
            precision: 2
          }
        },
        moon: {
          x: 0,
          y: -CONSTANTS.MOON_Y,
          radius: CONSTANTS.MOON_RADIUS * 15,
          radiusScaleMode: 0.1,
          velocity: new Vector2( CONSTANTS.MOON_SPEED, 0 ),
          mass: CONSTANTS.MOON_MASS,
          massLabel: {
            defaultValue: 0.01,
            text: earthMassesString,
            precision: 2
          }
        },
        options: {
          forceScale: 1.001,
          timeScale: 365.0 / 96.0, // days per seconds
          timeMode: timeModes[0],
          scale: 3.7E-7,
          centerX: 295,
          centerY: 235
        }
      },
      {
        earth: {
          x: 0,
          y: 0,
          radius: CONSTANTS.EARTH_RADIUS * 0.8,
          radiusScaleMode: 1.25,
          velocity: new Vector2( 0, CONSTANTS.SPACE_STATION_MASS * CONSTANTS.SPACE_STATION_SPEED / CONSTANTS.EARTH_MASS ), // vy to fulfill the law of conservation of momentum
          mass: CONSTANTS.EARTH_MASS,
          massLabel: {
            defaultValue: 16,
            text: billionBillionSatelliteMassesString
          }
        },
        spaceStation: {
          x: CONSTANTS.SPACE_STATION_PERIGEE + CONSTANTS.EARTH_RADIUS + CONSTANTS.SPACE_STATION_RADIUS,
          y: 0,
          radius: CONSTANTS.SPACE_STATION_RADIUS * 8000,
          radiusScaleMode: 0.1,
          velocity: new Vector2( 0, -CONSTANTS.SPACE_STATION_SPEED ),
          mass: CONSTANTS.SPACE_STATION_MASS,
          massLabel: {
            defaultValue: 1,
            text: satelliteMassesString,
            precision: 2
          }
        },
        options: {
          forceScale: 1,
          timeScale: 365.0 / 31855.0, // days per seconds
          timeMode: timeModes[1],
          scale: 2E-5,
          centerX: 280,
          centerY: 230
        }
      }
    ],
    fps = 60,
    lastDt = 0,
    distanceSquared = function( x1, y1, x2, y2 ) {
      var a = x2 - x1;
      var b = y2 - y1;
      return a * a + b * b;
    };

  /**
   * @param {Number} width of sim
   * @param {Number} height of sim
   * @param {String} viewMode "Cartoon" or "To Scale"
   */
  function GravityAndOrbitsModel( width, height, viewMode ) {
    var gravityAndOrbitsModel = this;
    this.viewModes = [cartoonString, toScaleString];
    this.viewMode = viewMode; // 'cartoon', 'to scale'
    this.timeModes = timeModes;
    this.CONSTANTS = CONSTANTS;
    this.isTapeUnitsMiles = true; // use in measuring tape miles or meters metric system

    this.spaceObjects = ['sun', 'earth', 'moon', 'spaceStation'];

    // possible planet modes
    this.planetModes = planetModes;

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {
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
      speed: 1, // 1.75, 1, 0.25
      drag: '', // current dragging object
      refreshMode: false, // refresh current planetMode
      showExplosion: false, // check explosion flag
      day: 0, // current day
      dayOffset: 0, // offset from zero day
      scale: 1, // scale coefficient
      scaleCenter: new Vector2( 0, 0 ), // scale center
      rewind: false // rewind trigger
    } );

    // add property for space objects
    this.spaceObjects.forEach( function( el ) {
      gravityAndOrbitsModel[el] = new SpaceObjectModel();
    } );

    this.spaceObjects.forEach( function( el ) {
      var body = gravityAndOrbitsModel[el];

      // add observers for mass sliders
      body.massCoeffProperty.link( function( newCoeff, prevCoeff ) {
        body.mass *= newCoeff / (prevCoeff || 1); // divide by (prevCoeff || 1) to return to the default mass value and multiply by a new coefficient

        // change radius
        body.radiusCoeff = Math.pow( newCoeff, 1 / 3 );
      } );

      // resize view if radius changed
      body.radiusCoeffProperty.link( function( newCoeff, oldCoeff ) {
        // return to initial proportions
        if ( oldCoeff ) {
          body.view.scale( 1 / oldCoeff );
        }

        body.view.scale( newCoeff );
      } );
    } );

    this.reset();
  }

  inherit( PropertySet, GravityAndOrbitsModel, {
    step: function( dt ) {
      if ( !lastDt ) {lastDt = dt;} // init lastDt value

      if ( this.play ) {
        // prevent incorrect behaviour when running in background
        // Slower machines should run at reduced frame rate, not at reduced speed
        if ( dt > 1 || dt <= 0 ) {
          dt = 1.0 / 60.0;
        }
        this.stepManual( dt );
      }
    },
    reset: function() {
      var gravityandOrbitsModel = this;
      this.showExplosion = false;
      PropertySet.prototype.reset.call( this );

      // reset all modes
      this.planetModes.forEach( function( mode, i ) {
        gravityandOrbitsModel.planetMode = i;
        gravityandOrbitsModel.refreshMode = true;
      } );

      this.planetModeProperty.reset();
      this.showExplosion = true;
    },
    stepManual: function( dt ) {
      var dDay, model = this,
        mode = this.planetModes[this.planetMode],
        scale = mode.options.scale,
        forceScale = mode.options.forceScale,
        timeScale = 24 * 60 * 60 * 0.967,
        STEPS = 10,
        i,
        j,
        currentObj,
        body;
      dt = dt || 1 / fps;

      dDay = dt * this.speed * this.planetModes[this.planetMode].options.timeScale;
      this.day += dDay;

      dt = dDay * timeScale / STEPS;

      for ( j = 0; j < STEPS; j++ ) {
        for ( i = 0; i < this.spaceObjects.length; i++ ) {
          currentObj = this.spaceObjects[i];

          // change position of not fixed or dragging objects
          if ( mode[currentObj] && !mode[currentObj].fixed && currentObj !== model.drag ) {
            body = this[currentObj];

            body.position.x = (body.position.x / scale + body.velocity.x * dt + body.acceleration.x * dt * dt / 2) * scale;
            body.position.y = (body.position.y / scale + body.velocity.y * dt + body.acceleration.y * dt * dt / 2) * scale;

            var velocityHalfX = body.velocity.x + body.acceleration.x * dt / 2;
            var velocityHalfY = body.velocity.y + body.acceleration.y * dt / 2;

            var force = getForce.call( this, currentObj, getForceResult );
            body.acceleration.x = force.x * (-forceScale / body.mass);
            body.acceleration.y = force.y * (-forceScale / body.mass);

            body.velocity.x = velocityHalfX + body.acceleration.x * dt / 2;
            body.velocity.y = velocityHalfY + body.acceleration.y * dt / 2;
          }
        }
      }

      // notify observers
      this.spaceObjects.forEach( function( el ) {
        var body = model[el];
        body.positionProperty.notifyObserversStatic();
        body.accelerationProperty.notifyObserversStatic();
        body.velocityProperty.notifyObserversStatic();
      } );
    }
  } );

  /**
   * Gets the force between two objects. Uses the passed in result as a "micro-pool" to avoid allocations.
   * @param target
   * @param result
   * @returns {*}
   */
  var getForce = function( target, result ) {
    var fx = 0, fy = 0,
      currentObj,
      sourceBody,
      model = this,
      targetBody = model[target],
      mode = model.planetModes[model.planetMode],
      scale = mode.options.scale,
      targetPosX = targetBody.position.x / scale,
      targetPosY = targetBody.position.y / scale,
      sourcePosX, sourcePosY;

    // zero vector, for no gravity
    if ( model.gravity ) {
      for ( var i = 0; i < model.spaceObjects.length; i++ ) {
        currentObj = model.spaceObjects[i];
        sourceBody = model[currentObj];
        sourcePosX = sourceBody.position.x / scale;
        sourcePosY = sourceBody.position.y / scale;

        // ignore computation if that body has exploded,
        // or if they are on top of each other, force should be infinite, but ignore it since we want to have semi-realistic behavior
        if ( mode[currentObj] && currentObj !== target && !sourceBody.exploded && !(targetPosX === sourcePosX && targetPosY === sourcePosY) ) {

          //Do math component-wise to save on garbage collection, see #84
          //F.add( getUnitVector( sourcePos, targetPos ).multiply( CONSTANTS.G * sourceBody.mass * targetBody.mass / distanceSquared ) );
          var distSquared = distanceSquared( targetPosX, targetPosY, sourcePosX, sourcePosY );
          var distance = Math.sqrt( distSquared );
          var unitVectorX = (targetPosX - sourcePosX) / distance;
          var unitVectorY = (targetPosY - sourcePosY) / distance;

          fx = fx + unitVectorX * CONSTANTS.G * sourceBody.mass * targetBody.mass / distSquared;
          fy = fy + unitVectorY * CONSTANTS.G * sourceBody.mass * targetBody.mass / distSquared;
        }
      }
    }
    result.x = fx;
    result.y = fy;
    return result;
  };

  //Micro-pool for sourcePosition used as temporary variable in getForce method.  Prevents 40 allocations/frame in the default screen & conditions.
  var getForceResult = new Vector2();
  return GravityAndOrbitsModel;
} );
