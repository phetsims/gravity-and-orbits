// Copyright 2002-2013, University of Colorado Boulder

/**
 * The string plugin loader has problems if you try to load the strings from different relative paths
 * So just load them once and make them easily available
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';
  return require( 'i18n!../nls/gravity-and-orbits-strings' );
} );