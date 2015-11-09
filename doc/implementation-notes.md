# Gravity and Orbits - Implementation Notes

This document contains notes that will be helpful to developers and future maintainers of this simulation.

## Structure

This sim is structured in an atypical way as a result of being a direct port from a Java sim and due to
the fact that it has 4 "modes" for each screen.

The GravityAndOrbitsScreenView file takes as an argument a GravityAndOrbitsModule object instead of a model
as is typical. There is one module object for each screen. Each module object has 4 GravityAndOrbitsMode objects
associated with it. These modes represent the different planetary configurations (sun + earth,
earth + satellite, etc.). Each mode has its own GravityAndOrbitsModel associated with it because the state of
each of these models must be remembered independently. The configuration for each mode can be found in the file
ModeConfig.

## Memory Management

All observer/observable relationships exist for the lifetime of the sim. So there is no need to call the various
memory-management functions associated with objects (unlink, dispose, detach, etc.)
