// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import { filtersChange } from '../../actions'

const filterLabels = {
	all: 'Все',
	fire: 'Огонь',
	water: 'Вода',
	wind: 'Ветер',
	earth: 'Земля',
}

const HeroesFilters = () => {
	const filters = useSelector(state => state.filters)
	const activeFilter = useSelector(state => state.activeFilter)
	const dispatch = useDispatch()

	if (!filters || !filters.length) return null

	const handleFilterClick = filter => {
		dispatch(filtersChange(filter))
	}

	const renderFilters = () => {
		return filters.map(filter => {
			const isActive = filter === activeFilter
			const isAll = filter === 'all'

			return (
				<button
					key={filter}
					type="button"
					className={classNames(
						'btn',
						{
							'btn-outline-dark': isAll,
							'btn-danger': filter === 'fire',
							'btn-primary': filter === 'water',
							'btn-success': filter === 'wind',
							'btn-secondary': filter === 'earth',
						},
						{ 'btn-dark': isActive && !isAll },
						{ active: isActive },
					)}
					onClick={() => handleFilterClick(filter)}>
					{filterLabels[filter] || filter}
				</button>
			)
		})
	}

	return (
		<div className="card shadow-lg mt-4">
			<div className="card-body">
				<p className="card-text">Отфильтруйте героев по элементам</p>
				<div className="btn-group">{renderFilters()}</div>
			</div>
		</div>
	)
}

export default HeroesFilters
