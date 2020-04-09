import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useQuery } from '../.';

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon'

interface IPokemon {
  name: string;
  sprites: {
    front_default: string
  }
}

const Pokemon = ({ name }) => {
  const { refetch, ...state } = useQuery<IPokemon>(`${POKEMON_URL}/${name}`)

  if (state.loading) {
    return (<div><h1>Loading</h1></div>)
  }

  if (state.error) {
    return (<div><h1>Error Loading {name}: {state.error.message}</h1></div>)
  }

  const { name: pokeName, sprites: { front_default } } = state.data
  return (<div>
    <h1>{pokeName}</h1>
    <img src={front_default} />
    <button onClick={() => refetch()}>Reload!</button>
  </div>)
}

const Pokedex = () => {

  return (<div/>)
  //     <input onChange={e => setSearch(e.target.value)}
  //   </div>
  // )
}

const App = () => {
  return (
    <div>
      <Pokemon name="pikachu" />
      <Pokedex />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
