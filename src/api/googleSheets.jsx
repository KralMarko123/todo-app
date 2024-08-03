const googleSheetEndpoint = process.env.REACT_APP_SCRIPT_API;
const GoogleSheetsService = {
	async fetchSpreadsheet() {
		return await fetch(googleSheetEndpoint, {
			method: 'GET'
		})
			.then(async (response) => {
				return response.json();
			})
			.catch((error) => {
				console.error('Error fetching CSV data:', error);
			});
	},

	async uploadToDo(todo) {
		let bodyToSend = {
			id: todo.id,
			text: todo.text,
			completed: '0',
			action: 'CREATE'
		};

		return await fetch(googleSheetEndpoint, {
			redirect: 'follow',
			method: 'POST',
			body: JSON.stringify(bodyToSend),
			headers: {
				'Content-Type': 'text/plain'
			}
		})
			.then(async (response) => {
				return response.status;
			})
			.catch((error) => {
				console.log(error);
			});
	},

	async updateToDo(id, completed) {
		let bodyToSend = {
			id: id,
			completed: completed ? '1' : '0',
			action: 'UPDATE'
		};

		return await fetch(googleSheetEndpoint, {
			redirect: 'follow',
			method: 'POST',
			body: JSON.stringify(bodyToSend),
			headers: {
				'Content-Type': 'text/plain'
			}
		})
			.then(async (response) => {
				return response.status;
			})
			.catch((error) => {
				console.log(error);
			});
	},

	async removeToDo(id) {
		let bodyToSend = {
			id: id,
			action: 'DELETE'
		};

		return await fetch(googleSheetEndpoint, {
			redirect: 'follow',
			method: 'POST',
			body: JSON.stringify(bodyToSend),
			headers: {
				'Content-Type': 'text/plain'
			}
		})
			.then(async (response) => {
				return response.status;
			})
			.catch((error) => {
				console.log(error);
			});
	}
};

export default GoogleSheetsService;
