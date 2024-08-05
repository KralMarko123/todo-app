import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFormattedToDos } from '../util/helperFunctions';
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

		const newToDo = {
			id: uuidv4(),
			text: newToDoText,
			completed: false
		};

		setIsAddingToDo(true);
		const todoAddedSuccessfully = await GoogleSheetsService.uploadToDo(newToDo, username);

		if (todoAddedSuccessfully === 200) {
			setTodos((prev) => [...prev, newToDo]);
			inputRef.current.value = '';
		}

		setIsAddingToDo(false);
	};

	const toggleToDo = async (id, toggle) => {
		const todoUpdatedSuccessfully = await GoogleSheetsService.updateToDo(id, toggle, username);

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
