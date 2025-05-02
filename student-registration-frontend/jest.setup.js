require('@testing-library/jest-dom');
const React = require('react');
global.React = React;

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props);
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

jest.mock('next/link', () => {
  return function Link(props) {
    return React.createElement('a', props, props.children);
  };
});
