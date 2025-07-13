import React from "react";

interface Props {
  onSearch: (term: string) => void;
  initialTerm: string;
  onThrowError: () => void;
}

interface State {
  input: string;
}

class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { input: props.initialTerm };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.input.trim();
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={this.state.input}
          onChange={this.handleInputChange}
          className="border p-2 rounded w-full"
          placeholder="Enter Pokémon name"
        />
        <button
          onClick={this.handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={this.props.onThrowError}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Throw Error
        </button>
      </div>
    );
  }
}

export default SearchBar;
    