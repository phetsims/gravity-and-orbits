/* eslint-disable */
import MipmapElement from '../../phet-core/js/MipmapElement.js';

// The levels in the mipmap. Specify explicit types rather than inferring to assist the type checker, for this boilerplate case.
const mipmaps = [
  new MipmapElement( 147, 85, 'data:image/png;base64,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' ),
  new MipmapElement( 74, 43, 'data:image/png;base64,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' ),
  new MipmapElement( 37, 22, 'data:image/png;base64,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' ),
  new MipmapElement( 19, 11, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAALCAYAAACd1bY6AAAAAklEQVR4AewaftIAAAI4SURBVJ3BT0gUUQAH4N/Mvpl5s+64m6utboJhZCfTPNQllXAlhKKg6GQZVuRNEKtLXqoF6+AhumYUHepQBEJ5USLMwCjb/iDJ4iS01qZts7ujvpmdfa8lOoaQ3ydhE450nzNaey9diBplnX4q3KON0XaUSPgP15++P2vURk4Qt9gSCtBwNu9iC5VXE5OPd13t70sRbOBUd7e/qmbb8eV0evrQxfj9PNS9Qc0n5ZiLnMWgB31YZ6KsJdZ1GkCcYAMVVZHpL6bZ5Hmelc/mEqtyuaQUKbgAwoYCIgvYkoS0o7cBiBP8NTRyZ3tzrON86heP+dYyH4X5enx+/nO9EByapoWeP7znHOzph1YG5JiKNc8B4wRuEaj0k0aUkLuzi0NWgXZSj+3hmhGojRSgCL+YfjYwHNR3BhBykLIEnO+m6Qr+UxQR9hEBWZYRUhUQmcNhXvWNsZljpFCkfQYQ9Rsqll0JESpjxXIaWpvNdkrmpOUlB6OT+xCpibJyVSRtRwprGoHLGBwmwDVSMFQvJWvlO0iIKnPCKUa5JyMADzmbw/bpQa5fbq1ciQsrB0knHhaSyQ9recapoeymPixyIpKplWzC/jb/qPdk1yxKSNq2Xm1VAx0aJXBsBqIqqNMkmNVtdfh0a9Bh67GGirl0Jls/82ZibFx43vDNK4M/8A8k+Xbqds2BwwMZT/h1KgtFRsblrklD6syZa4kRACP4YwkvXk5hIxJKHrz7Oso9d7XA8hM9+5ueYJN+AyLw/OL934UFAAAAAElFTkSuQmCC' ),
  new MipmapElement( 10, 6, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAklEQVR4AewaftIAAADRSURBVGNkwAI6t10y5ZcQTeNkYLLjYfl/IlhPIp6FAQnkFxTlPXnyxFtYXEiLjZFRho2FgeHbH8Y/DEDAOPX0s3I+VkZPpn9/BS4t73z55PEzN5OYiiv8cvI67Ex/GZj+Mv18/OihCQsfI0vRf0ZGsV/MzH9s1G/8PfPlHQPr3+9H2BgZFf58+/+IiYPxJhMbnxALGyvD9T+M/0U5mRg/P5Jr2cl+1n/9zkXT5ytqG5dMair5ygAFLP///5ry/+f36aFmqisZ4GA5A8Pa5QzIAAABQkopiuzeBgAAAABJRU5ErkJggg==' )
];

export default mipmaps;