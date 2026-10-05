import './App.scss'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import HeroesList from '../heroesList/HeroesList'
import HeroesAddForm from '../heroesAddForm/HeroesAddForm'
import HeroesFilters from '../heroesFilters/HeroesFilters'

const App = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		fetch('http://localhost:3001/filters')
			.then(res => {
				if (!res.ok) throw new Error(`Could not fetch filters, status: ${res.status}`)
				return res.json()
			})
			.then(filters => dispatch({ type: 'FILTERS_FETCHED', payload: filters }))
			.catch(err => console.error('Ошибка загрузки фильтров:', err))
	}, [dispatch])

	return (
		<main className="app">
			<div className="content">
				<HeroesList />
				<div className="content__interactive">
					<HeroesAddForm />
					<HeroesFilters />
				</div>
			</div>
		</main>
	)
}

export default App
