// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import { filtersChanged, fetchFilters, selectAll } from './filtersSlice'
import Spinner from '../spinner/Spinner'

// const filterLabels = {
// 	all: 'Все',
// 	fire: 'Огонь',
// 	water: 'Вода',
// 	wind: 'Ветер',
// 	earth: 'Земля',
// }

const HeroesFilters = () => {
	// const filters = useSelector(state => state.filters)
	// const activeFilter = useSelector(state => state.activeFilter)
	// const dispatch = useDispatch()

	// if (!filters || !filters.length) return null

	// const handleFilterClick = filter => {
	// 	dispatch(filtersChange(filter))
	// }
	const { filtersLoadingStatus, activeFilter } = useSelector(state => state.filters)
	const filters = useSelector(selectAll)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchFilters())
		// eslint-disable-next-line
	}, [])

	if (filtersLoadingStatus === 'loading') {
		return <Spinner />
	} else if (filtersLoadingStatus === 'error') {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>
	}

	const renderFilters = arr => {
		if (arr.length === 0) {
			return <h5 className="text-center mt-5">Фильтры не найдены</h5>
		}

		return arr.map(({ name, className, label }) => {
			const btnClass = classNames('btn', className, {
				active: name === activeFilter,
			})

			return (
				<button key={name} id={name} className={btnClass} onClick={() => dispatch(filtersChanged(name))}>
					{label}
				</button>
			)
		})
	}

	const elements = renderFilters(filters)

	return (
		<div className="card shadow-lg mt-4">
			<div className="card-body">
				<p className="card-text">Отфильтруйте героев по элементам</p>
				<div className="btn-group">{elements}</div>
			</div>
		</div>
	)
}

export default HeroesFilters
