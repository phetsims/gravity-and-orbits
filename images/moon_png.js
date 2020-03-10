/* eslint-disable */
var img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;