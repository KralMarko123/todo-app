import React, { useState, useRef, useEffect } from 'react';
import { getFormattedToDo, getFormattedToDos } from '../util/helperFunctions';
import GoogleSheetsService from '../api/googleSheets';
import Spinner from './Spinner';
import ToDo from './ToDo';
import './Main.css';

const Main = ({ username }) => {
	const [todos, setTodos] = useState([]);
	const [isFetchingToDos, setIsFetchingToDos] = useState(true);
	const [isAddingToDo, setIsAddingToDo] = useState(false);
	const inputRef = useRef();

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') addNewToDo();
	};

	const addNewToDo = async () => {
		const newToDoText = inputRef.current.value;
		if (newToDoText.length === 0) return;

		setIsAddingToDo(true);
		const todoAddedSuccessfully = await GoogleSheetsService.uploadToDo(newToDoText, username);

		if (todoAddedSuccessfully.status === 200) {
			console.log(todoAddedSuccessfully.todo);

			setTodos((prev) => [...prev, getFormattedToDo(todoAddedSuccessfully.todo)]);
			inputRef.current.value = '';
		}

		setIsAddingToDo(false);
	};

	const toggleToDo = async (id, toggle) => {
		const todoUpdatedSuccessfully = await GoogleSheetsService.updateToDo(id, username);

		if (todoUpdatedSuccessfully === 200) {
			setTodos(todos.map((td) => (td.id === id ? { ...td, completed: toggle } : td)));
		}
	};

	const removeToDo = async (id) => {
		const todoRemovedSuccessfully = await GoogleSheetsService.removeToDo(id, username);

		if (todoRemovedSuccessfully === 200) {
			setTodos(todos.filter((td) => td.id !== id));
		}
	};

	const getCSVToDos = async () => {
		await GoogleSheetsService.fetchSpreadsheet(username)
			.then((todos) => {
				if (todos) setTodos(getFormattedToDos(todos));
			})
			.finally(() => setIsFetchingToDos(false));
	};

	useEffect(() => {
		getCSVToDos();
	}, []);

	return (
		<>
			<h1 className='title'>Marko's TODO</h1>

			<div className='input container'>
				<input
					disabled={isAddingToDo}
					placeholder='Add item here...'
					type='text'
					className={`todo_input${isAddingToDo ? ' adding' : ''}`}
					ref={inputRef}
					onKeyDown={(e) => handleKeyDown(e)}
				/>
				<button className='todo_button' onClick={async () => await addNewToDo()}>
					<span>{isAddingToDo ? <Spinner /> : 'Add New Entry'}</span>
				</button>
			</div>

			{isFetchingToDos ? (
				<Spinner />
			) : (
				<div className='todos container'>
					{todos.length > 0 ? (
						todos.map((td) => (
							<ToDo
								key={td.id}
								id={td.id}
								text={td.text}
								completed={td.completed}
								toggleToDo={toggleToDo}
								removeToDo={removeToDo}
							/>
						))
					) : (
						<h1 className='title'>No Items Yet</h1>
					)}
				</div>
			)}
		</>
	);
};

export default Main;
