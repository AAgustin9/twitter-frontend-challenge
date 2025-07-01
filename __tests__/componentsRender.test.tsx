import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import { ThemeProvider } from 'styled-components';
import { LightTheme } from '../src/util/LightTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../src/components/toast/ToastProvider';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Stub i18n translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { changeLanguage: jest.fn() } }),
}));

// Wrap rendered components with all required context providers
const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider theme={LightTheme}>
      <QueryClientProvider client={new QueryClient()}>
        <ToastProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </Provider>
);

// Import components to smoke-test
import Button from '../src/components/button/Button';
import { ButtonType } from '../src/components/button/StyledButton';
import SwitchButton from '../src/components/switch/SwitchButton';
import ThreeDots from '../src/components/common/ThreeDots';
import Avatar from '../src/components/common/avatar/Avatar';
import NameImage from '../src/components/common/avatar/NameImage';
import Loader from '../src/components/loader/Loader';
import ImageInput from '../src/components/common/ImageInput';
import { ModalCloseButton } from '../src/components/common/ModalCloseButton';
import TweetInput from '../src/components/tweet-input/TweetInput';

// Smoke tests
describe('Smoke test components render without crashing', () => {
  test('Button renders', () => {
    render(
      <AllProviders>
        <Button text="Test" size="SMALL" buttonType={ButtonType.DEFAULT} />
      </AllProviders>
    );
  });

  test('SwitchButton renders', () => {
    render(
      <AllProviders>
        <SwitchButton checked={false} onChange={() => {}} />
      </AllProviders>
    );
  });

  test('ThreeDots renders', () => {
    render(
      <AllProviders>
        <ThreeDots onClick={() => {}} />
      </AllProviders>
    );
  });

  test('Avatar renders', () => {
    render(
      <AllProviders>
        <Avatar src="https://example.com/avatar.png" alt="Avatar" />
      </AllProviders>
    );
  });

  test('NameImage renders', () => {
    render(
      <AllProviders>
        <NameImage name="User" />
      </AllProviders>
    );
  });

  test('Loader renders', () => {
    render(
      <AllProviders>
        <Loader />
      </AllProviders>
    );
  });

  test('ImageInput renders', () => {
    render(
      <AllProviders>
        <ImageInput setImages={() => {}} parentId="123" />
      </AllProviders>
    );
  });

  test('ModalCloseButton renders', () => {
    render(
      <AllProviders>
        <ModalCloseButton onClick={() => {}} />
      </AllProviders>
    );
  });

  test('TweetInput renders', () => {
    render(
      <AllProviders>
        <TweetInput maxLength={100} placeholder="Type here" />
      </AllProviders>
    );
  });
}); 