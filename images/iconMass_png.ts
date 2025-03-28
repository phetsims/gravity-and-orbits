/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAeCAYAAABTwyyaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4VJREFUeNrsWM1OE1EUPlP6My21TEKrURfMQtQFxnEJLqgJiUvqE1QTo0voEyhPgCwxJtAnoDwBJdEVELsR2QANiaIbKM1M2+nP1HMmd8hQZsrM2NbEcJrTezvtuee73/m5MwW4lmv5v4Xrx6Kv37wVcfiKKqCWUJ99+rhc6KUPX58IEQWUmZnnMH5vnMCneu3AfwVzLwmEh3XTxiQQCNAwh2t5wVfASOVcA0dZ6RFBxPq7XqazvwvbApvmUTddOptFlUyfKc+XPESt5CVVjLwUMFzvXRYnbXbDdGnJwxoEXKRCR9uim+KcRl0g5kzsD0TQn2SKdsptVyGDVdRcP7qCgzQh0Oss7ZwBxx0T0CIL0aadcR8lxUATaUmriPu6FFeezXXjAaaJyOoqh1qySxc74AQ0SxPGepFFYVBsm3v3Oqu37l3FKIyOIzrPopC7gi1yOkeMybIMOztboKo1PWfxO3KexXVXHeT3gulzjp0Br65iPG0BMNstXWizqGs4XWO/k5rNJpyenkClUgF2+tL1Ffzdhl30WJpIpjQ1Il7qtPHbhCpjvkDs05FNAG1uljbuP3go8HwYGo0GDA0N6Ud9wO+HII6kmqZBTVVBVpTk3t4uFdwTi7Voc0ZuQwfr02ZC/XaFYQHOKJJCh00yHI4IY2OiDkxV6+BHwHwwCCHSUAh4VK3VAhnZ58MRSNy8Bcc/f1xai6XjuoXvLItmxi5VUl3y2K6nSrGRmKvq40M8DWMWtxiW/llkBNPBdAl42mbHwKIgsaiY5fHoaNwV8OFoFDruZQzSChZpAlZtmTPteBGHeRY+O2OJff/CcIB2h5NTT8Vo9IajVKlUq9DAwv3yeZPI4EzdaNHBLTT5zFBnMuf4/OTkFFRrqqTW63phkWNySnNyqKAeHRWTZ6US3ad/YOEV4/E41GqqK9ajyDrVB4Kg2klPTDwSb9+5Cwpurt0GiIR5iGCxD0fCSEgdzspl+PX7WPi++42y4gJwvSM4FCMiUiKR8HTKUISw15+3PmqbJ9g+dQIQuVoLQTWogCKHoI64aEOKrFi2w8z29tasQ9DnBdSoNzwBbzYv2C0cHOwLcLDvxDTz1w/LrFAPY7ERvXdrbQ3aWhs4jgPOx4GP84GPjW18aS0NWtjPKbKKIgN7iM73/JnTyUMxvZXLZ17tL5ySA/17ggrMq61Xtq/lX8gfAQYA6Fhy0L+2pAsAAAAASUVORK5CYII=';
export default image;