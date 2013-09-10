// Copyright 2002-2013, University of Colorado Boulder

/**
 * Images loader for this simulation.
 *
 * This object will be extended lazily after the image loader completes.
 * Makes it possible to load through the module system rather having to
 * pass as a parameter everywhere or resort to using a global.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function() {
  'use strict';
  return {
    imageNames: [
      'cartoon_icon.png',
      'icon_mass.png',
      'icon_mass.svg',
      'icon_path.png',
      'measuringTape.png',
      'measuringTape.svg',
      'reset_arrow.png',
      'reset_arrow.svg',
      'to_scale_icon.png',
      'earth.gif',
      'moon.png',
      'space-station.png',
      'reset_button_up.png',
      'reset_button_over.png',
      'reset_button_down.png',
      'reset_button_disabled.png',
      'slider.png'
    ]
  };
} );