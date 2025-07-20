import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import React from 'react';
import { vi } from 'vitest';

const ProblemChild = () => {
  throw new Error('Test error');
};

const ThrowingButton = () => {
  const [crash, setCrash] = React.useState(false);
  if (crash) throw new Error('Button crash');
  return <button onClick={() => setCrash(true)}>Trigger Error</button>;
};

describe('ErrorBoundary', () => {
  const consoleErrorMock = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  afterEach(() => {
    consoleErrorMock.mockClear();
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  it('catches and handles JavaScript errors in child components', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('displays fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/reload page/i)).toBeInTheDocument();
  });

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(consoleErrorMock).toHaveBeenCalled();
  });

  it('throws error when test button is clicked and shows fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText(/trigger error/i));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
