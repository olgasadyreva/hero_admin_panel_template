import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'

const heroesAdapter = createEntityAdapter()

// useHttp — это React-хук, его нельзя вызывать внутри createAsyncThunk (вне компонента),
// поэтому здесь используется обычная функция-обёртка над fetch
const request = (url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {
	return fetch(url, { method, body, headers }).then(res => {
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`)
		}
		return res.json()
	})
}

const initialState = heroesAdapter.getInitialState({
	heroesLoadingStatus: 'idle',
})

export const fetchHeroes = createAsyncThunk('heroes/fetchHeroes', () => request('http://localhost:3001/heroes'))

const heroesSlice = createSlice({
	name: 'heroes',
	initialState,
	reducers: {
		heroCreated: (state, action) => {
			heroesAdapter.addOne(state, action.payload)
		},
		heroDeleted: (state, action) => {
			heroesAdapter.removeOne(state, action.payload)
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchHeroes.pending, state => {
				state.heroesLoadingStatus = 'loading'
			})
			.addCase(fetchHeroes.fulfilled, (state, action) => {
				state.heroesLoadingStatus = 'idle'
				heroesAdapter.setAll(state, action.payload)
			})
			.addCase(fetchHeroes.rejected, state => {
				state.heroesLoadingStatus = 'error'
			})
			.addDefaultCase(() => {})
	},
})

const { actions, reducer } = heroesSlice

export default reducer

const { selectAll } = heroesAdapter.getSelectors(state => state.heroes)

export const filteredHeroesSelector = createSelector(
	state => state.filters.activeFilter,
	selectAll,
	(filter, heroes) => {
		if (filter === 'all') {
			return heroes
		} else {
			return heroes.filter(item => item.element === filter)
		}
	},
)

export const { heroesFetching, heroesFetched, heroesFetchingError, heroCreated, heroDeleted } = actions
