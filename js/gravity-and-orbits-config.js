// Copyright 2002-2013, University of Colorado Boulder

/*
 * RequireJS configuration file for the 'Gravity and Orbits Lab' sim.
 * Paths are relative to the location of this file.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

require.config( {

  deps: ['gravity-and-orbits-main'],

  config: {
    i18n: {
      locale: 'en_us'
    }
  },

  paths: {

    // plugins
    image: '../../chipper/requirejs-plugins/image',
    audio: '../../chipper/requirejs-plugins/audio',
    string: '../../chipper/requirejs-plugins/string',

    text: '../../sherpa/text',

    // PhET libs, uppercase names to identify them in require.js imports
    ASSERT: '../../assert/js',
    AXON: '../../axon/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    PHET_CORE: '../../phet-core/js',
    PHETCOMMON: '../../phetcommon/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SUN: '../../sun/js',
    GRAVITY_AND_ORBITS: '.'
  },

  urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
} );
