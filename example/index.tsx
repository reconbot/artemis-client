import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useQuery as useArtemisQuery } from '../.';
import { useQuery as useApolloQuery, ApolloClient, HttpLink, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://graphql-pokemon.now.sh',
  })
});


interface IPokemon {
  name: string;
  description: string;
  sprites: {
    front_default: string
  }
}

const Pokemon = ({ name }) => {
  const { refetch, data, loading, error } = useArtemisQuery<IPokemon>(`${POKEMON_URL}/${name}`)
  console.log({ artemis: { refetch, data, loading, error }})

  if (loading) {
    return (<div><h1>Loading</h1></div>)
  }

  if (error) {
    return (<div><h1>Error Loading {name}: {error.message}</h1></div>)
  }

  if (!data) {
    return (<div><h1>Error No data</h1></div>)
  }

  const { name: pokeName, sprites: { front_default } } = data
  return (<div>
    <h1>{pokeName}</h1>
    <img src={front_default} />
    <button onClick={() => refetch()}>Reload!</button>
  </div>)
}

const POKEMON_QUERY = gql`
query {
  pokemon(name: "pikachu") {
    name
    image
  }
}
`;

const GraphQLPokemon = ({ name }) => {
  const { refetch, data, loading, error } = useApolloQuery(POKEMON_QUERY)
  console.log({ apollo: { refetch, data, loading, error }})
  if (loading) {
    return (<div><h1>Loading</h1></div>)
  }

  if (error) {
    return (<div><h1>Error Loading {name}: {error.message}</h1></div>)
  }

  if (!data) {
    return (<div><h1>Error No data</h1></div>)
  }

  const { pokemon: { name: pokeName, image } } = data

  return (<div>
    <h1>{pokeName}</h1>
    <img src={image} />
    <button onClick={() => refetch()}>Reload!</button>
  </div>)
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <Pokemon name="pikachu" />
        <GraphQLPokemon name="pikachu" />
      </div>
    </ApolloProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
