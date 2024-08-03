export const getFormattedToDos = (todos) => {
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
