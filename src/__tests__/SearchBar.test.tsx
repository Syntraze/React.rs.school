import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  const onSearch = vi.fn();
  const onThrowError = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    onSearch.mockReset();
    onThrowError.mockReset();
  });

  it('renders input and buttons', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm=""
      />
    );
    expect(screen.getByPlaceholderText(/enter pokémon/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/throw error/i)).toBeInTheDocument();
  });

  it('displays initialTerm from props', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm="pikachu"
      />
    );
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('updates input value on typing', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm=""
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'charmander' } });
    expect(input.value).toBe('charmander');
  });

  it('calls onSearch with trimmed value', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm=""
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '  bulbasaur  ' } });
    fireEvent.click(screen.getByText(/search/i));
    expect(onSearch).toHaveBeenCalledWith('bulbasaur');
  });

  it('calls onThrowError when button is clicked', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm=""
      />
    );
    fireEvent.click(screen.getByText(/throw error/i));
    expect(onThrowError).toHaveBeenCalled();
  });


  it('matches snapshot', () => {
    const { container } = render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm="charizard"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('keeps input value controlled even after props change', () => {
    const { rerender } = render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm="mew"
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('mew');
    fireEvent.change(input, { target: { value: 'mewtwo' } });
    expect(input.value).toBe('mewtwo');
    rerender(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm="ditto"
      />
    );
    expect(input.value).toBe('mewtwo');
  });

  it('trims input value on search without modifying the input field', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm="  squirtle  "
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('  squirtle  ');
    fireEvent.click(screen.getByText(/search/i));
    expect(onSearch).toHaveBeenCalledWith('squirtle');
    expect(input.value).toBe('  squirtle  ');
  });


  it('calls onSearch with empty string if input contains only spaces', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm="   "
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('   ');
    fireEvent.click(screen.getByText(/search/i));
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('renders correct number of buttons', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm=""
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('input is focusable and receives focus on click', () => {
    render(
      <SearchBar
        onSearch={onSearch}
        onThrowError={onThrowError}
        initialTerm=""
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
  });
});
