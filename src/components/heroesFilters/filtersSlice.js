import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

const filtersAdapter = createEntityAdapter()

// useHttp — это React-хук, его нельзя вызывать внутри createAsyncThunk (вне компонента),
// поэтому здесь используется обычная функция-обёртка над fetch
const request = (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
	return fetch(url, { method, body, headers }).then(res => {
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`)
		}
		return res.json()
	})
}

const initialState = filtersAdapter.getInitialState({
	filtersLoadingStatus: 'idle',
	activeFilter: 'all',
})

export const fetchFilters = createAsyncThunk('filters/fetchFilters', () => {
	return request('http://localhost:3001/filters')
})

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		filtersChanged: (state, action) => {
			state.activeFilter = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFilters.pending, state => {
				state.filtersLoadingStatus = 'loading'
			})
			.addCase(fetchFilters.fulfilled, (state, action) => {
				state.filtersLoadingStatus = 'idle'
				filtersAdapter.setAll(state, action.payload)
			})
			.addCase(fetchFilters.rejected, state => {
				state.filtersLoadingStatus = 'error'
			})
			.addDefaultCase(() => {})
	},
})

const { actions, reducer } = filtersSlice

export default reducer

export const { selectAll } = filtersAdapter.getSelectors(state => state.filters)

export const { filtersFetching, filtersFetched, filtersFetchingError, filtersChanged } = actions
