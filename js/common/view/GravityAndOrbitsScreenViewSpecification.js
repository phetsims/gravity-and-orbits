// Copyright 2014-2020, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NodeSpecification from '../../../../scenery/js/nodes/NodeSpecification.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import CheckboxSpecification from '../../../../sun/js/CheckboxSpecification.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';

// constants
const gridString = gravityAndOrbitsStrings.grid;

// NOTE https://github.com/phetsims/phet-io/issues/1657 We can choose whatever level of granularity is appropriate
// For instance, we could have these checks here in the screen view, or we could put it in GravityAndOrbitsControlPanel
// or GravityAndOrbitsCheckboxPanel
class GravityAndOrbitsScreenViewSpecification extends NodeSpecification {
  constructor( gravityAndOrbitsScreenView ) {
    super( gravityAndOrbitsScreenView );

    const resetAllButtons = gravityAndOrbitsScreenView.getLeafTrails( node => node instanceof ResetAllButton );
    assert && assert( resetAllButtons.length === 1, 'should have exactly 1 reset all button' );

    const gridCheckboxes = gravityAndOrbitsScreenView.getLeafTrails( node => node instanceof Checkbox && node.getLeafTrails( n => n.text === gridString ).length > 0 );
    assert && assert( gridCheckboxes.length === 1, 'should have a checkbox labeled "grid"' );

    const gridCheckbox = gridCheckboxes[ 0 ].lastNode();
    assert && assert( new CheckboxSpecification( gridCheckbox, {
      // TODO: For testing https://github.com/phetsims/phet-io/issues/1657, pretend the spec calls for MODEL events to test failure
      // phetioEventType: EventType.MODEL,

      // This is a shortcut for "don't care"--could be used if this test isn't supposed to require a specific subtandem
      tandem: gridCheckbox.tandem
    } ) );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsScreenViewSpecification', GravityAndOrbitsScreenViewSpecification );
export default GravityAndOrbitsScreenViewSpecification;