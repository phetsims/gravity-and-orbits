# Gravity and Orbits model

This document describes the model for the Gravity and Orbits simulation.


## Algorithm

The model uses an algorithm based on exponential decompositions from this paper: http://arxiv.org/pdf/cond-mat/0110585v1.pdf, equation 22.

Here is the algorithm for stepping from time *t* to *t + h*:

```
 r1 = r(t) + v(t)ξh
 v1 = v(t) + 1/m f[r1](1 − 2λ)h/2
 r2 = r1 + v1χh
 v2 = v1 + 1/m f[r2]λh
 r3 = r2 + v2(1 − 2(χ + ξ))h
 v3 = v2 + 1/m f[r3]λh
 r4 = r3 + v3χh
 v(t + h) = v3 + 1/m f[r4](1 − 2λ)h/2
 r(t + h) = r4 + v(t + h)]ξh
```

where

```
ξ = +0.1786178958448091E+00
λ = −0.2123418310626054E+00
χ = −0.6626458266981849E−01
```
