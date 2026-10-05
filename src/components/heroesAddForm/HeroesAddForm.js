import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'

import { heroesAdd } from '../../actions'
import { useHttp } from '../../hooks/http.hook'

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const elementNames = {
	fire: 'Огонь',
	water: 'Вода',
	wind: 'Ветер',
	earth: 'Земля',
}

const HeroesAddForm = () => {
	const { request } = useHttp()
	const dispatch = useDispatch()
	const filters = useSelector(state => state.filters)

	const [form, setForm] = useState({
		name: '',
		text: '',
		element: '',
	})
	const [creating, setCreating] = useState(false)
	const [error, setError] = useState(null)

	const handleChange = e => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (creating) return

		setError(null)

		const hero = {
			id: uuid(),
			name: form.name,
			description: form.text,
			element: form.element,
		}

		setCreating(true)

		request('http://localhost:3001/heroes', 'POST', JSON.stringify(hero))
			.then(data => {
				dispatch(heroesAdd(data))
			})
			.catch(() => {
				dispatch(heroesAdd(hero))
			})
			.finally(() => {
				setCreating(false)
				setForm({ name: '', text: '', element: '' })
			})
	}

	const options =
		filters && filters.length
			? filters
					.filter(f => f !== 'all')
					.map(f => (
						<option key={f} value={f}>
							{elementNames[f] || f}
						</option>
					))
			: [
					<option key="fire" value="fire">
						Огонь
					</option>,
					<option key="water" value="water">
						Вода
					</option>,
					<option key="wind" value="wind">
						Ветер
					</option>,
					<option key="earth" value="earth">
						Земля
					</option>,
				]

	return (
		<form className="border p-4 shadow-lg rounded" onSubmit={handleSubmit}>
			<div className="mb-3">
				<label htmlFor="name" className="form-label fs-4">
					Имя нового героя
				</label>
				<input required type="text" name="name" className="form-control" id="name" placeholder="Как меня зовут?" value={form.name} onChange={handleChange} />
			</div>

			<div className="mb-3">
				<label htmlFor="text" className="form-label fs-4">
					Описание
				</label>
				<textarea required name="text" className="form-control" id="text" placeholder="Что я умею?" style={{ height: '130px' }} value={form.text} onChange={handleChange} />
			</div>

			<div className="mb-3">
				<label htmlFor="element" className="form-label">
					Выбрать элемент героя
				</label>
				<select required className="form-select" id="element" name="element" value={form.element} onChange={handleChange}>
					<option disabled value="">
						Я владею элементом...
					</option>
					{options}
				</select>
			</div>

			{error && <p className="text-danger mb-3">{error}</p>}

			<button type="submit" className="btn btn-primary" disabled={creating}>
				{creating ? 'Создание...' : 'Создать'}
			</button>
		</form>
	)
}

export default HeroesAddForm
