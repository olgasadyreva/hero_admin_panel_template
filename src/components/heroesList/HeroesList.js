import { useHttp } from '../../hooks/http.hook'
import { useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { heroesFetching, heroesFetched, heroesFetchingError, heroesDelete } from '../../actions'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import HeroesListItem from '../heroesListItem/HeroesListItem'
import Spinner from '../spinner/Spinner'
import './HeroesList.scss'

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
	const heroes = useSelector(state => state.heroes)
	const heroesLoadingStatus = useSelector(state => state.heroesLoadingStatus)
	const activeFilter = useSelector(state => state.activeFilter)
	const dispatch = useDispatch()
	const { request } = useHttp()
	const nodeRefs = useRef({})

	useEffect(() => {
		dispatch(heroesFetching())
		request('http://localhost:3001/heroes')
			.then(data => dispatch(heroesFetched(data)))
			.catch(() => dispatch(heroesFetchingError()))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleHeroDelete = useCallback(
		id => {
			request(`http://localhost:3001/heroes/${id}`, 'DELETE')
				.then(() => dispatch(heroesDelete(id)))
				.catch(() => console.error('Ошибка удаления героя'))
		},
		[request, dispatch],
	)

	const filteredHeroes = useMemo(() => {
		if (!heroes) return []
		if (!activeFilter || activeFilter === 'all') return heroes
		return heroes.filter(hero => hero.element === activeFilter)
	}, [heroes, activeFilter])

	if (heroesLoadingStatus === 'loading') return <Spinner />
	if (heroesLoadingStatus === 'error') return <h5 className="text-center mt-5">Ошибка загрузки</h5>

	if (!filteredHeroes.length) {
		return (
			<div className="d-flex justify-content-center mt-5">
				<h5 className="text-center">Героев по элементу "{activeFilter}" не найдено</h5>
			</div>
		)
	}

	const renderHeroesList = arr => {
		return (
			<TransitionGroup component="ul" className="heroes-list">
				{filteredHeroes.map(hero => {
					if (!nodeRefs.current[hero.id]) {
						nodeRefs.current[hero.id] = React.createRef()
					}
					return (
						<CSSTransition key={hero.id} classNames="hero-item" timeout={300} nodeRef={nodeRefs.current[hero.id]}>
							<HeroesListItem ref={nodeRefs.current[hero.id]} {...hero} onHeroDelete={handleHeroDelete} />
						</CSSTransition>
					)
				})}
			</TransitionGroup>
		)
	}

	return renderHeroesList(filteredHeroes)
}

export default HeroesList
