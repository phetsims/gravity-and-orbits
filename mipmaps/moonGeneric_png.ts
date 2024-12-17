/* eslint-disable */
/* @formatter:off */

import MipmapElement from '../../chipper/js/browser/MipmapElement.js';

// The levels in the mipmap. Specify explicit types rather than inferring to assist the type checker, for this boilerplate case.
const mipmaps = [
  new MipmapElement( 100, 98, 'data:image/png;base64,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IWIJESJEiJCCKiwhQoQURIiQgogRe0GEFERIQYQIKegFEboQIQW9oBf0gl6QghREiBAhBREipCBCCiL2wggRUhAhQoQIJZaQgioooYQIEUuIULK7NCz7+IlXtYlh50WMeAmL3v/mGxacdNAtW7/30CltcgwUAgqN/yHQeJbgABCagEADBASa0BoqtAZNWmvQhNZ4VgOaQIPGjsk2goBspyCoIKAgUIJACQIllFiAQgkllFBACSWWEEHZXc52Jo9ec8eiC4/8W3ZgwEsZDVxxxam/xzNkO4USI0aIECFChBSkMGKEFEToQoQIESJETGEXe2EKInQhBb2gF0SIECFCL+gFKehCxBT2wi6mIEKECF2IECFCCiJGqIIIESJESGHECBGU3SZgseIP3vn7bXI4zw4M2AkLzl5706ILjvgbZ2f5XwoRUhghQoQIEUqIkMIIEVIQIQVd6AVd6EIKIkTshSnsYsSIvbAX9sJeGDFiF1PYCyJESEGECL2gCymI0AsiRowQIUIKIkQosYQIJSh7wtk5Fp75pq8tvODwf+QlDNhJK688/bcHS6c204ufEEqIGDFCCiJESEGEiCmMGCFChAgpiBAhBREiREhBL4gQIUKECBEipCBChAgpiNCFXhAhQsSIESNESEEJESJEKDFChCpQ9khksGB8y8rPnPFxGi9pwE4aO3T5Ays/eerl1ed5HoUSUhghQoQIEVIQIUIvjJiCCBFSECFCL4jQhQgRekEvSEEKUtALekGELkToBREipCBCxBRG6AURUpCCCCmIELEKI0Qo2Rtqfpbll598xfix0/ewEwbsgqUf++lrFp556I3OzPE8CiVEjJiCCBEiREhBhF7QxRRGjNgLuxChF6SgCxEiROhCF7oQIUIXUtALInYxhREjpiBCCiKkIEKECF1MYYQupEDZG5yZZ+qUg29edtlJn2UnDdgVg8b0hrPXjVYvfoS58IIUIkSMmIIIKYiQgggp6EIv6EKEFHYxYsQU9sKIESNGjBixF6YwYsQupKALXegFEVIQIUKECF1MYYQIEZS9Zr4YLpv88fQXzv21Nj4MO2nALhqtXfrw9OfPvVgsIi9MKCEFESN2IUKECBEiREhBhC6kIAW9IEKEXtALekEv6AW9IEKELqQgBREipCBCF7rQhRRETGGECCWUgOw1JSasuvrs3xh7y8p72QUDdsPUeW/65gGfPuMTNT8HsmMlpCBiL4yYgggpiBAhBSmI0IUIvSAFKYgQIUKEFKSgF6QgQoQupCBChBRETGHECF2IUIKyt9XcLCt+95RPLrrwLX/PLhqxm5b9zkl/Mv/vm9du3nDbpYPJSV6SgoBAAxvQgCbQaA1oQBNo0HiuJs8hzyXbCAKCbKMgIKAgoOxLNTPDkouO/csVf3Tap9gNI/bAqj8782N5bOsBT/3dnRcNJifZKQqyjdAaz2pia9DYrsmzWqOxY7KN8izZTkBBtlNeDjUzy6L3Hv4P0184Zx2N3TJiT4wNXH3deb+CjD91/V0/P5icYJcoz5JtBBo0tmtsI7JN44XJT8h2yiuhZmaZeufB/7TmK+df2BaMOrtpxB5q48P5NdeddxGap7561wcHE5PQ2E2CbCf7jZqZYdE5h92weuP5H2xLxrewBwbsDRPD+dUbz79o6cXHb6jZWSj5P6GgZmZY/IGjv7zm+vdfMFg+uYU9NFy/fj17QxsNXPhzh93QQt/6L/e/q9lg2HjN6oXz86z4rXf88fTnz/1oGx+EvWDEXrbiUz/z6fHDV9y96aPf3FCbZ1a2yTFea5yZZ7Bw/MlVnzvrN5esO/av2ItG7AOLPnTU9ePHTN+5ad3XN2y99cHTBmPjMGzs90pqbpbJ415/6/Q156ybOOl1/8ZeNly/fj37wnDNwh8t/tBR1zFvZr730MnO9lEbDdlfOTNPg77s0rd/Zs2X3/erozcue5B9YMQ+1BaM5ldedcYVC88/7MbHLr/pqi3fuf9drY1oE0P2F84Fq7PghAO/u/LKMy5b8O6Dv8s+NFy/fj372uinljy85JeP+dLYgUvum7vrR0f2R586gGq04YBXrfmi5ucYO2jJvQf84emXTV991qVjhy1/gH1sxMtl2Fiy7rgvLfrAEV994pp//fUnN9z+kbn7Hz+0MaRNjKDxyhOc7UgYO3DZ/SvWHXv1kkuO/4vh9NRmXiYjXmaD5ZNPL7/8HX+69MPHffGpjXf9wpNfvGPd7O0/fLsUg+EIxga87HpRvdNoTBwz/f3FFx9z7ZJfOmrjYHpqMy+zEa+QwYrJp5Z+5G3XLr3kuGu3/PP9pz/9lbsu3PKt+3+2P/jkQVK0NqKNDWDQ2OtKnC80NGC0ZvEji9598NcXX3jkxgXvOeSmNjEMr5ARr7TRgKlz1t48dc7am+uxrUu33vTAqVu+cd97t97y0Gnz924+ombmRiCNAQwGtOEABg0aL02gxBSUSHjGYGI8429e/oPJkw/8ztS5b/zagtPf8O3h6oWP8yow4lVksHLBEwsvOPzGhRccfqOzGc7f8+PDZm575G1zt//whNm7Hju6P/Dk2jy6ZbX/Ob/YHkRAnq/RaLThkLZo7OnRygWbRgctvm/86APunDh+9W0TJ7zu++NHrPhBmxzN8yoz4lWqTQwz/tZVd4+/ddXdwEa2ccv8RDZtWZlNW6bz6JZV2Ty7vJ6YXUxjEhgAIlsHS8afHi6bfHy4aurR4fTUpuGqqcfaorEZ9gMj9iNtamx2dMjSh0eHLH2Y16gB/+9V5b8A04tz7TAJJ+UAAAAASUVORK5CYII=' ),
  new MipmapElement( 50, 49, 'data:image/png;base64,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' ),
  new MipmapElement( 25, 25, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAklEQVR4AewaftIAAATDSURBVMXBTYidVx3H8e//nPPcuXMz06mSmLFpjGmkpQuLXblQRKHQkEaEilSruBDra2kKLkREBYvYhdAyviAKCq0vLYiKVlJRUMQsqkQKpZtoSlOxSpohk9w7c5/nOef8f965GWqJiV36+Rivol7owouffOLDdX3r7dqs+4kM1Hu1aGdtMT69+zNv+97S4UPn+B+Mqxj/4q+r69946isU3a6ifZYCcy5UBdlRW8H9AlEnBgdWvnb9z+/6HVdgXMGZoz/+tE/y54hxnw0ClgIEY86FikN21FZoK5oW1OWJrYTv33DyE/dxGeMyzx/54YParPfbsFmwYYSFAClg0dimKigOnaO2ommBrYI2M5r0sGK/Onjio+8OKwtiR+QVnj/86Bc1qZ+1YTOwXQ2MEjZK2GKDDRO2EGEQsRgggJkBAoG5wEEb5caNx07esnb2+OPsiOz4+3sfv91f6h+yYRrZKMEoYbsabJSwUcIWI7YQIQUsGJgBwlzggDtUQRFaLzcde9ORuHb2yd8zE9hRXtz8AtGuYRBhELFhxIYRRg221MDyAJYH2FIDowZbjNhChIUITYAUIAVIhsUQdK58fPzos6vMBGZeeM9jd6r1txINkkFj0ARYCNgwYqOELTfY8gAbNdgwwiBCEyAFSIalgEXDokEwdFF7zz7wmy8xk5gp/xzfbRaSBcPMsGAQDKJBMhhEbNSAgVzQGUSDYFgAzJABBpiBgZmhrr6TmcC2Vm9mm5iTuESAAAlc4OI/xDZxddrQoQvfffpg8I024lrFhSTkAhdUQRFkh9bRJKNxhmmF3iELqqAKuZALBLhAgANTNRvfOXlH6k6f36NJWWY5YEVQHLJDX1EXIAbmemOuCLUVugp9hexQHIpQcVSFqkDCgLy5sT9RFckO2SE79I66CilgISBmqkM05qqgq6itqK2oc+gdskMRFIfqIGYMIpbS3l3rRFp6X1RXoQlYNAgBAVYd9RWiMVcF2VFbYVqhrairqKvQV8gO2UEgROoXz8cHHn6wHHvt4Y/Rs2LRMDMwAwQSVEER9BW6Cp3DtKK2wLSitsBWhbagaUHTAr0zZ/JrPvKWzydmFHSKrr6BGMAMA+SOFaGBQzIIxpwLiqB31FVoK5oWNK2ordA7iDnbHf+x56vv+lNiJq4Ofln/Nb0NM8SMC2qE7NAESAEz5iSgOGRHvUNX0bTCtEBboYqXLdlTzARmDp741Bqv4ZS2CtrMaDOjSUaTjMYZXezROKNxRuMejTOaZJhkNMloK6OtAtlBzGlJW8Mb9n6dmcSO+PqFtXpx+hBbalQdy46aAMmwaMiMOQlVQRX0jvoKvUMViDkhwu7mZ9cf/+AfmAnsOPjne7/JvvQTVYdpRZOMJhmNMxpnNM5onNE4o0lG44w2M0wrFIF4mV0Xntn/0w/dww7jMn+7+eEndDrfYRgYlxhgxpwE4hLx3/ZwanTLgQ9cd/x9f2FH5DJr55780bEbj7xRvd9svSW2CRAgQFyRkGxf+OO1d976/r0/OPosr2BcxXPv+Nbd9cz0fs75rZYtcRVC2N5w2q5tHjn0zH1f5gqMV/HCbY8c7c+s30XRTXT+OkaW6OV4OM+Q5+Lq4q8P/Paeb4dh4v/q3w9IshFKP0y0AAAAAElFTkSuQmCC' ),
  new MipmapElement( 13, 13, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAAklEQVR4AewaftIAAAHYSURBVKXBP0hVURzA8e/vnHPv83IxNdJIgoxsamiIxoJayqWWoCkqaIgCyzFag5oidMtJLGoIagyHlv4sQUQEEYSWhJYoT2/v3ffuveeeX29waO/zEf7xfeLxOe2Gy8A4PvRpUTcp/ft4bODu3hfnF9kmbFs6OT+LsxckdQ2JDFoFaHlCs0C3Oqs09NaBz9fn6LH0LB2beyCxvWqGk8gMJ5ihBpJEYAUJCt3Qr83y+I19pz9Mr71cNMtnnx5SHy6RRkYGYsxIgoymmJEEGYwhjZDEIWJ2hnV/mx7jl7MrggyIE4gMJBYz2IDEQWQQJ2AFjEChR7dmPw457dQHcQGtAlIGaHlC6ELuoQhoFdA6QK2Qa7o+83rC0fUGa9FWhTYLgirEFsoa3SzRloe8RgsPCvjaOZX6B1kFcUlQkI4HJ+AVbVXoZolmJeQ19NHdcebwK2dH4/n6S/cikFB6NHOIFTQo5B7NKnSzAK/QL5+G7534afa/vfaONDwLGx3CrxxdbRNW2uhKm/A7Rze6UAQ00bYZdPfpsfRMZwvPJ3efOsKf+iCtWsg9tGsoAtSgiWayy94Z/zb1kB7Ltpls4cnk2EQbdEgiGqR4Yta0nzdmT2Nq/OvNR/yPv+Zn6ut2TzTpAAAAAElFTkSuQmCC' ),
  new MipmapElement( 7, 7, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAklEQVR4AewaftIAAACvSURBVIXBsQ7BUBQG4P/c22hHbTcrCYuExGSxMHgNg0UsvIlYJBKTwWtYhamDBYOIFGGg1ertPbyB7yP8HFrzKSzZxluZ+hJ60Mkg7/U2Yl+fjcgxO0bZzcmS7QrbavBDTfBj4KObZEmirAloBjICSLi6q40rBj8ioU8BwACHCnyLwG9FxFIa/IqW6TYt6nMAJCn4GgOSvfy6vxYFf9jlOF7o4/POfhgwqxU5so9/vlmrUQt6Fy7LAAAAAElFTkSuQmCC' )
];

export default mipmaps;