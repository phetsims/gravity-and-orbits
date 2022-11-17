// Copyright 2022, University of Colorado Boulder

/**
 * Pruned interface to allow interruption of subtree input from the scene reset button, so we don't
 * have to pass the entire ScreenView through.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
type Interruptable = {
  interruptSubtreeInput(): void;
};

export default Interruptable;