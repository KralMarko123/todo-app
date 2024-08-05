export const formatToDos = (todos) => {
	todos = todos.slice(1);

	if (todos.length > 0) {
		let formattedToDos = todos.map((td) => ({
			id: td[0],
			text: td[1],
			completed: td[2] === 0 ? false : true
		}));

		return formattedToDos;
	}

	return [];
};

export const formatToDo = (todo) => {
	return {
		id: todo[0],
		text: todo[1],
		completed: todo[2] === '0' ? false : true
	};
};

export const sortToDosByCompleted = (todos) => {
	return todos.sort((x, y) => y.completed - x.completed);
};
