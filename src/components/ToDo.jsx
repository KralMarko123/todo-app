import React from 'react';
import { MdDelete, MdCheck, MdAdd } from 'react-icons/md';
import './ToDo.css';

const ToDo = ({ id, text, completed, restoreToDo, completeToDo, removeToDo }) => {
	return (
		<div className={`todo_entry${completed ? ' complete' : ''}`}>
			<span className={`todo_text${completed ? ' complete' : ''}`}>{text}</span>
			<div className='todo_icons'>
				<div
					className={`todo_icon ${completed ? 'todo_add' : 'todo_complete'}`}
					onClick={() => (completed ? restoreToDo(id) : completeToDo(id))}
				>
					<span>{completed ? <MdAdd /> : <MdCheck />}</span>
				</div>
				<div className='todo_icon todo_delete' onClick={() => removeToDo(id)}>
					<span>
						<MdDelete />
					</span>
				</div>
			</div>
		</div>
	);
};

export default ToDo;
