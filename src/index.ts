import { useState, useEffect, useCallback } from 'react'

interface QueryOptions {
  fetchOptions?: any
  variables?: object
}

interface ErrorState {
  loading: false;
  error: Error;
  data: null;
}

interface LoadingState {
  loading: true;
  error: null;
  data: null;
}

interface ValueState<T> {
  loading: false;
  error: null;
  data: T;
}

export const useQuery = <T extends any>(
    url: string,
    options: QueryOptions = {}
  ) => {
  const [state, setState] = useState<ErrorState|LoadingState|ValueState<T>>({
    loading: true,
    data: null,
    error: null,
  })

  const [reloadTrigger, setReload] = useState(true)
  const [variables, setVariables] = useState(options.variables)

  useEffect(() => {
    setVariables(options.variables)
  }, [options.variables])

  useEffect(() => {
    const abort = new AbortController()
    fetch(url, { signal: abort.signal }).then(async resp => {
      const data = await resp.json()
      setState({
        loading: false,
        error: null,
        data,
      })
    }).catch((error: Error) => {
      setState({
        loading: false,
        error,
        data: null,
      })
    })

    return () => {
      abort.abort()
    }
  }, [url, variables, reloadTrigger])

  const refetch = useCallback((variables) => {
    if (variables) {
      setVariables(variables)
    }
    setReload(!reloadTrigger)
  }, [reloadTrigger])

  console.log(state)
  return {
    ...state,
    refetch,
    variables,
  } // networkStatus, startPolling, stopPolling
}


// export const useLazyQuery = (url: string, options: QueryOptions) => {


//   const state = {
//     loading, error, variables, data, refetch, networkStatus, called, startPolling
//   }

//   const query = async (variables) => {

//   }

//   return [query, state]
// }
