# Gravity and Orbits model

This document describes the model for the Gravity and Orbits simulation.


## Algorithm

The model uses an algorithm based on exponential decompositions from this paper: http://arxiv.org/pdf/cond-mat/0110585v1.pdf, equation 22.

Here is the algorithm for stepping from time *t* to *t + h* for a given body (i.e. a planet, star, space station, etc.):

r<sub>1</sub> = r(t) + v(t)ξh

v<sub>1</sub> = v(t) + (1/m) f[r<sub>1</sub>](1 − 2λ)h/2

r<sub>2</sub> = r<sub>1</sub> + v<sub>1</sub>χh

v<sub>2</sub> = v<sub>1</sub> + (1/m) f[r<sub>2</sub>]λh

r<sub>3</sub> = r<sub>2</sub> + v<sub>2</sub>(1 − 2(χ + ξ))h

v<sub>3</sub> = v<sub>2</sub> + (1/m) f[r<sub>3</sub>]λh

r<sub>4</sub> = r<sub>3</sub> + v<sub>3</sub>χh

v(t + h) = v<sub>3</sub> + (1/m) f[r<sub>4</sub>](1 − 2λ)h/2

r(t + h) = r<sub>4</sub> + v(t + h)]ξh

where

ξ = +0.1786178958448091E+00

λ = −0.2123418310626054E+00

χ = −0.6626458266981849E−01

f = the net force on the body due to other bodies

h = the time delta

m = the body's mass

r = the body's position

t = time

v = the body's velocity

##Units

Numbers in the model use the following units:

Distance: km

Mass: kg

Velocity: m/s

Acceleration: m/s<sup>2</sup>
