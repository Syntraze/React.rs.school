import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

interface State {
  term: string;
  throwError: boolean;
}

class App extends React.Component<object, State> {
  constructor(props: object) {
    super(props);
    const savedTerm = localStorage.getItem('searchTerm') || '';
    this.state = {
      term: savedTerm,
      throwError: false,
    };
  }

  handleSearch = (term: string) => {
    localStorage.setItem('searchTerm', term);
    this.setState({ term });
  };

  triggerRenderError = () => {
    this.setState({ throwError: true });
  };

  render() {
    if (this.state.throwError) {
      throw new Error('Simulated render error from App');
    }

    return (
      <div className="flex flex-col min-h-screen p-4 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <SearchBar
            initialTerm={this.state.term}
            onSearch={this.handleSearch}
            onThrowError={this.triggerRenderError}
          />
        </div>
        <div className="flex-grow bg-white p-4 rounded shadow border">
          <SearchResults term={this.state.term} />
        </div>
      </div>
    );
  }
}

export default App;
