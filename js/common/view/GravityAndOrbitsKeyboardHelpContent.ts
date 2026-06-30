// Copyright 2026, University of Colorado Boulder

/**
 * GravityAndOrbitsKeyboardHelpContent is the content for the keyboard-help dialog, shared by both screens of the
 * simulation. The draggable objects (bodies, velocity vectors, and the measuring tape) are all moved with the arrow
 * keys, so they are documented by a single MoveDraggableItemsKeyboardHelpSection; the mass and zoom sliders are
 * documented by the SliderControlsKeyboardHelpSection.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';

export default class GravityAndOrbitsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Left column: moving the draggable bodies, velocity vectors, and measuring tape.
    const moveDraggableItemsSection = new MoveDraggableItemsKeyboardHelpSection();

    // Right column: the mass and zoom sliders, then the generic actions (Tab, checkboxes, Reset All).
    const sliderControlsSection = new SliderControlsKeyboardHelpSection();
    const basicActionsSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    // Vertically align the icons of the stacked right-column sections.
    KeyboardHelpSection.alignHelpSectionIcons( [ sliderControlsSection, basicActionsSection ] );

    super( [ moveDraggableItemsSection ], [ sliderControlsSection, basicActionsSection ], {
      isDisposable: false
    } );
  }
}
