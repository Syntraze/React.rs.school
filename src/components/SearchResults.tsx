import React from "react";
import '../styles/SearchResults.css';

interface Props {
  term: string;
}

interface ResultItem {
  name: string;
  url: string;
  image: string;
  height?: number;
  weight?: number;
}

interface State {
  loading: boolean;
  error: string | null;
  results: ResultItem[];
}

class SearchResults extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      results: [],
    };
  }

  componentDidMount() {
    this.fetchResults(this.props.term);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.term !== this.props.term) {
      this.fetchResults(this.props.term);
    }
  }

  fetchResults = async (term: string) => {
    this.setState({ loading: true, error: null, results: [] });

    try {
      if (!term) {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        const detailedResults = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const detailRes = await fetch(pokemon.url);
            if (!detailRes.ok)
              throw new Error(`Failed to fetch ${pokemon.name}`);
            const detail = await detailRes.json();
            return {
              name: detail.name,
              url: pokemon.url,
              image: detail.sprites.front_default,
            };
          })
        );

        this.setState({ results: detailedResults });
      } else {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${term.trim().toLowerCase()}`
        );
        if (res.status === 404) {
          throw new Error(`No Pokémon found with name "${term}"`);
        }
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        this.setState({
          results: [
            {
              name: data.name,
              url: `https://pokeapi.co/api/v2/pokemon/${data.id}`,
              image: data.sprites.front_default,
              height: data.height,
              weight: data.weight,
            },
          ],
        });
      }
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      this.setState({ error: errorMessage });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, error, results } = this.state;

    if (loading)
      return <p className="animate-pulse text-blue-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
      <ul className="results space-y-2">
        {results.map((item) => (
          <li key={item.name} className="p-2 border rounded shadow-sm">
            <h3 className="font-bold capitalize">{item.name}</h3>
            <img src={item.image} alt={`${item.name} sprite`} />
            {item.height !== undefined && <p>Height: {item.height}</p>}
            {item.weight !== undefined && <p>Weight: {item.weight}</p>}
            <p>
              URL:{" "}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {item.url}
              </a>
            </p>
          </li>
        ))}
      </ul>
    );
  }
}

export default SearchResults;
