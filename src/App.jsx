import React, { useState, useRef, useEffect } from 'react';
import { MdDelete, MdCheck, MdAdd } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import GoogleSheetsService from './api/googleSheets';
import { CONSTANTS } from './constants/CONSTANTS';
import Spinner from './components/Spinner';

const App = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const inputRef = useRef();

	const addNewToDo = async () => {
		const newToDoText = inputRef.current.value;
		if (newToDoText.length === 0) return;

		const newToDo = {
			id: uuidv4(),
			text: newToDoText,
			completed: false
		};
		const todoAddedSuccessfully = await uploadToDo(newToDo);

		if (todoAddedSuccessfully === 200) {
			setTodos((prev) => [...prev, newToDo]);
			inputRef.current.value = '';
		}
	};

	const completeToDo = (id) => {
		setTodos(todos.map((td) => (td.id === id ? { ...td, completed: true } : td)));
	};

	const restoreToDo = (id) => {
		setTodos(todos.map((td) => (td.id === id ? { ...td, completed: false } : td)));
	};

	const removeToDo = (id) => {
		setTodos(todos.filter((td) => td.id !== id));
	};

	const getCSVToDos = async () => {
		await GoogleSheetsService.fetchSpreadsheet()
			.then((todos) => {
				if (todos.length > 0) {
					setTodos(
						todos.map((td) =>
							td.completed === '0' ? { ...td, completed: false } : { ...td, completed: true }
						)
					);
				}
			})
			.finally(() => setIsLoading(false));
	};

	const uploadToDo = async (todo) => {
		let formData = new FormData();

		formData.append('id', todo.id);
		formData.append('text', todo.text);
		formData.append('completed', '0');

		return await axios
			.post(CONSTANTS.GOOGLE_SHEET_SCRIPT, formData, {
				headers: { 'content-type': 'multipart/form-data' }
			})
			.then(async (response) => {
				return response.status;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getCSVToDos();
	}, []);

	return (
		<div className='todo_app'>
			<h1 className='title'>Marko's TODO</h1>

			<div className='input container'>
				<input placeholder='Add item here...' type='text' className='todo_input' ref={inputRef} />
				<button className='todo_button' onClick={async () => await addNewToDo()}>
					<span>Add New Entry</span>
				</button>
			</div>

			{isLoading ? (
				<Spinner />
			) : (
				<div className='todos container'>
					{todos.length > 0 ? (
						todos.map((td) => (
							<div className={`todo_entry${td.completed ? ' complete' : ''}`} key={td.id}>
								<span className={`todo_text${td.completed ? ' complete' : ''}`}>{td.text}</span>
								<div className='todo_buttons'>
									<div
										className={`todo_icon ${td.completed ? 'todo_add' : 'todo_complete'}`}
										onClick={() => (td.completed ? restoreToDo(td.id) : completeToDo(td.id))}
									>
										<span>{td.completed ? <MdAdd /> : <MdCheck />}</span>
									</div>
									<div className='todo_icon todo_delete' onClick={() => removeToDo(td.id)}>
										<span>
											<MdDelete />
										</span>
									</div>
								</div>
							</div>
						))
					) : (
						<h1 className='title'>No Items Yet</h1>
					)}
				</div>
			)}
		</div>
	);
};

export default App;
