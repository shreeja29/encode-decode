import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('Symbol Cipher Tool App', () => {
  test('renders input and output textareas and buttons', () => {
    render(<App />);
    expect(screen.getByLabelText(/Input Text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Output Text/i)).toBeInTheDocument();
    expect(screen.getByText(/Encode/i)).toBeInTheDocument();
    expect(screen.getByText(/Decode/i)).toBeInTheDocument();
  });

  test('types in input textarea', () => {
    render(<App />);
    const input = screen.getByLabelText(/Input Text/i);
    fireEvent.change(input, { target: { value: 'Hello world' } });
    expect(input).toHaveValue('Hello world');
  });

  test('inserts tab on Tab key press', () => {
    render(<App />);
    const input = screen.getByLabelText(/Input Text/i);
  
    fireEvent.change(input, { target: { value: 'Line1' } });
  
   
    Object.defineProperty(input, 'selectionStart', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(input, 'selectionEnd', {
      writable: true,
      configurable: true,
      value: 0,
    });
  
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
  
  
    setTimeout(() => {
      expect(input).toHaveValue('\tLine1');
    }, 0);
  });
  
  test('shows toast on error from server', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ code: 'INPUT_TOO_LONG' }),
      })
    );

    render(<App />);
    const input = screen.getByLabelText(/Input Text/i);
    fireEvent.change(input, { target: { value: 'a'.repeat(300) } });
    fireEvent.click(screen.getByText(/Encode/i));

    await waitFor(() =>
      expect(screen.getByText(/Message exceeds 280 characters./i)).toBeInTheDocument()
    );

    global.fetch.mockRestore();
  });

  test('displays encoded output from API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ encoded: '@@##@@' }),
      })
    );

    render(<App />);
    fireEvent.change(screen.getByLabelText(/Input Text/i), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getByText(/Encode/i));

    await waitFor(() =>
      expect(screen.getByLabelText(/Output Text/i)).toHaveValue('@@##@@')
    );

    global.fetch.mockRestore();
  });
});
