import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import { ThemeProvider } from 'styled-components';
import { LightTheme } from '../src/util/LightTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../src/components/toast/ToastProvider';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { changeLanguage: jest.fn() } }),
}));

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

import Button from '../src/components/button/Button';
import { ButtonType } from '../src/components/button/StyledButton';
import SwitchButton from '../src/components/switch/SwitchButton';
import ThreeDots from '../src/components/common/ThreeDots';
import Avatar from '../src/components/common/avatar/Avatar';
import NameImage from '../src/components/common/avatar/NameImage';
import { ModalCloseButton } from '../src/components/common/ModalCloseButton';
import ImageInput from '../src/components/common/ImageInput';
import TweetInput from '../src/components/tweet-input/TweetInput';

describe('Unit tests for individual components', () => {
  test('Button calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(
      <AllProviders>
        <Button text="ClickMe" size="SMALL" buttonType={ButtonType.DEFAULT} onClick={onClick} />
      </AllProviders>
    );
    fireEvent.click(screen.getByText('ClickMe'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('SwitchButton calls onChange when clicked', () => {
    const onChange = jest.fn();
    const { container } = render(
      <AllProviders>
        <SwitchButton checked={false} onChange={onChange} />
      </AllProviders>
    );
    const checkbox = container.querySelector('input[type="checkbox"]')!;
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });

  test('ThreeDots calls onClick when container clicked', () => {
    const onClick = jest.fn();
    const { container } = render(
      <AllProviders>
        <ThreeDots onClick={onClick} />
      </AllProviders>
    );
    fireEvent.click(container.firstChild!);
    expect(onClick).toHaveBeenCalled();
  });

  test('Avatar displays provided src and alt', () => {
    render(
      <AllProviders>
        <Avatar src="https://example.com/pic.png" alt="AltText" />
      </AllProviders>
    );
    const img = screen.getByAltText('AltText') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('pic.png');
  });

  test('Avatar fallback renders NameImage when src is null', () => {
    render(
      <AllProviders>
        <Avatar src={null as any} alt="FallbackName" />
      </AllProviders>
    );
    expect(screen.getByText('FallbackName')).toBeInTheDocument();
  });

  test('NameImage shows the name text', () => {
    render(
      <AllProviders>
        <NameImage name="TestName" />
      </AllProviders>
    );
    expect(screen.getByText('TestName')).toBeInTheDocument();
  });

  test('ModalCloseButton triggers onClick when image is clicked', () => {
    const onClose = jest.fn();
    render(
      <AllProviders>
        <ModalCloseButton onClick={onClose} />
      </AllProviders>
    );
    fireEvent.click(screen.getByAltText('X'));
    expect(onClose).toHaveBeenCalled();
  });

  test('ImageInput calls setImages with at most 4 files', () => {
    const setImages = jest.fn();
    const { container } = render(
      <AllProviders>
        <ImageInput setImages={setImages} parentId="unit" />
      </AllProviders>
    );
    const input = container.querySelector('input[type="file"]')!;
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
      new File(['c'], 'c.png', { type: 'image/png' }),
      new File(['d'], 'd.png', { type: 'image/png' }),
      new File(['e'], 'e.png', { type: 'image/png' }),
    ];
    fireEvent.change(input, { target: { files } });
    expect(setImages).toHaveBeenCalledWith(files.slice(0, 4));
  });

  test('TweetInput displays value and calls onChange', () => {
    const onChange = jest.fn();
    render(
      <AllProviders>
        <TweetInput placeholder="TypeHere" maxLength={10} onChange={onChange} value="init" name="tweet" />
      </AllProviders>
    );
    const textarea = screen.getByPlaceholderText('TypeHere') as HTMLTextAreaElement;
    expect(textarea.value).toBe('init');
    fireEvent.change(textarea, { target: { value: 'new' } });
    expect(onChange).toHaveBeenCalled();
  });
}); 