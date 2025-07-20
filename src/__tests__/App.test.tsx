import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { vi, type Mock } from 'vitest';

global.fetch = vi.fn();

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads saved term from localStorage', async () => {
    localStorage.setItem('searchTerm', 'pikachu');

    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('updates localStorage on search', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/enter pokémon/i);
    fireEvent.change(input, { target: { value: 'mew' } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(localStorage.getItem('searchTerm')).toBe('mew');
    });
  });

  it('throws error when Throw Error button is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<App />);
      fireEvent.click(screen.getByText(/throw error/i));
    }).toThrow();
    spy.mockRestore();
  });
});
