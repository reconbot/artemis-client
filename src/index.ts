import { useState, useEffect, useCallback } from 'react'

interface QueryOptions {
  fetchOptions?: any
  variables?: object
}

interface LoadingState<T> {
  loading: boolean
  error?: Error
  data?: T
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
  const [state, setState] = useState<LoadingState<T>>(
    {
      loading: true,
      data: undefined,
      error: undefined,
    }
  )

  const [variables, setVariables] = useState(options.variables)

  useEffect(() => setVariables(options.variables), [options.variables])

  const doFetch = (vars = variables) => {
    setState({
      loading: true,
      error: undefined,
      data: state.data,
    })
    const { promise, abort } = startFetch(url, { variables: vars })
    promise.then(data => {
      setState({
        loading: false,
        error: undefined,
        data,
      })
    }, (error: Error) => {
      setState({
        loading: false,
        error,
        data: state.data,
      })
    })

    return abort
  }

  useEffect(() => doFetch(), [url, variables])

  const refetch = useCallback(doFetch, [url, variables])

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
