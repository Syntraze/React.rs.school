import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SearchResults from '../components/SearchResults';
import { vi, type Mock } from 'vitest';
import { mockData, mockDetail } from './test-utils/mock-server';

global.fetch = vi.fn();

describe('SearchResults', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading text initially', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });

    render(<SearchResults term="" />);

    await waitFor(() =>
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    );
  });

  it('renders a list of results', async () => {
    

    (fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      });

    render(<SearchResults term="" />);

    await waitFor(() =>
      expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    );
    expect(screen.getByAltText(/sprite/i)).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    (fetch as Mock).mockRejectedValueOnce(new Error('API down'));

    render(<SearchResults term="pikachu" />);

    await waitFor(() =>
      expect(screen.getByText(/api down/i)).toBeInTheDocument()
    );
  });

  it('shows no results message if term not found', async () => {
    (fetch as Mock).mockResolvedValueOnce({ status: 404, ok: false });

    render(<SearchResults term="xyz" />);

    await waitFor(() =>
      expect(screen.getByText(/no pokémon/i)).toBeInTheDocument()
    );
  });
});
