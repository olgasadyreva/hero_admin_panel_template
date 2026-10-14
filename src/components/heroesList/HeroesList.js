import { useHttp } from '../../hooks/http.hook'
import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { fetchHeroes, heroDeleted, filteredHeroesSelector } from './heroesSlice'

import HeroesListItem from '../heroesListItem/HeroesListItem'
import Spinner from '../spinner/Spinner'

import './HeroesList.scss'

const HeroesList = () => {
	const filteredHeroes = useSelector(filteredHeroesSelector)
	const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus)
	const dispatch = useDispatch()
	const { request } = useHttp()
	const nodeRefs = useRef({})

	useEffect(() => {
		dispatch(fetchHeroes())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onDelete = useCallback(
		id => {
			request(`http://localhost:3001/heroes/${id}`, 'DELETE')
				.then(data => console.log(data, 'Deleted'))
				.then(dispatch(heroDeleted(id)))
				.catch(err => console.log('Ошибка удаления героя'))
			// eslint-disable-next-line
		},
		[request, dispatch],
	)

	if (heroesLoadingStatus === 'loading') {
		return <Spinner />
	} else if (heroesLoadingStatus === 'error') {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>
	}

	if (filteredHeroes.length === 0) {
		return (
			<ul className="heroes-list">
				<li className="text-center mt-5">Героев пока нет</li>
			</ul>
		)
	}

	const renderHeroesList = arr => {
		if (arr.length === 0) {
			return <li className="text-center mt-5">Героев пока нет</li>
		}

		return arr.map(({ id, ...props }) => {
			if (!nodeRefs.current[id]) {
				nodeRefs.current[id] = { current: null }
			}
			return (
				<CSSTransition key={id} timeout={500} classNames="hero-item" nodeRef={nodeRefs.current[id]}>
					<HeroesListItem {...props} onDelete={() => onDelete(id)} ref={nodeRefs.current[id]} />
				</CSSTransition>
			)
		})
	}

	const elements = renderHeroesList(filteredHeroes)
	return (
		<TransitionGroup component="ul" className="heroes-list">
			{elements}
		</TransitionGroup>
	)
}

export default HeroesList
