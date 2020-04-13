import { useState, useEffect, useCallback } from 'react'

interface QueryOptions {
  fetchOptions?: any
  variables?: object
}

interface ErrorState {
  loading: false
  error: Error
  data: null
}

interface LoadingState {
  loading: true
  error: null
  data: null
}

interface ValueState<T> {
  loading: false
  error: null
  data: T
}

const startFetch = (url: string, { variables }: { variables?: object } = {}) => {
  const abortController = new AbortController()
  console.log('ignoring variables because reasons', { variables })
  const promise = fetch(url, { signal: abortController.signal })
    .then(async resp => resp.json())

  const abort = () => abortController.abort()

  return { promise, abort }
}

export const useQuery = <T extends any>(
  url: string,
  options: QueryOptions = {}
) => {
  const [state, setState] = useState<ErrorState | LoadingState | ValueState<T>>(
    {
      loading: true,
      data: null,
      error: null,
    }
  )

  const [variables, setVariables] = useState(options.variables)

  useEffect(() => setVariables(options.variables), [options.variables])

  const doFetch = (vars = variables) => {
    const { promise, abort } = startFetch(url, { variables: vars })
    promise.then(data => {
      setState({
        loading: false,
        error: null,
        data,
      })
    }, (error: Error) => {
      setState({
        loading: false,
        error,
        data: null,
      })
    })

    return abort
  }

  useEffect(() => doFetch(), [url, variables])

  const refetch = useCallback(doFetch, [url, variables])

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
