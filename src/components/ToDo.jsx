import React, { useState } from 'react';
import { MdDelete, MdCheck, MdAdd } from 'react-icons/md';
import Spinner from './Spinner';
import './ToDo.css';

const ToDo = ({ id, text, completed, toggleToDo, removeToDo }) => {
	const [isBeingUpdated, setIsBeingUpdated] = useState(false);

	const updateToDo = async () => {
		setIsBeingUpdated(true);

		await toggleToDo(id, !completed);

		setIsBeingUpdated(false);
	};

	const deleteToDo = async () => {
		setIsBeingUpdated(true);

		await removeToDo(id);

		setIsBeingUpdated(false);
	};

	return (
		<div
			className={`todo_entry${completed ? ' complete' : ''}${isBeingUpdated ? ' updating' : ''}`}
		>
			<span className={`todo_text${completed ? ' complete' : ''}`}>{text}</span>
			<div className='todo_icons'>
				{isBeingUpdated ? (
					<Spinner />
				) : (
					<>
						<div
							className={`todo_icon ${completed ? 'todo_add' : 'todo_complete'}`}
							onClick={() => updateToDo()}
						>
							<span>{completed ? <MdAdd /> : <MdCheck />}</span>
						</div>
						<div className='todo_icon todo_delete' onClick={() => deleteToDo()}>
							<span>
								<MdDelete />
							</span>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ToDo;
