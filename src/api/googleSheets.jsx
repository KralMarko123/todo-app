const googleSheetEndpoint = process.env.REACT_APP_SCRIPT_API;
const GoogleSheetsService = {
	async login(username) {
		let bodyToSend = {
			username: username,
			action: 'LOGIN'
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
				return response.text();
			})
			.catch((error) => {
				console.error(error);
			});
	},

	async fetchSpreadsheet(username) {
		const encodedUsername = encodeURIComponent(username);
		const endpointWIthUsername = `${googleSheetEndpoint}?username=${encodedUsername}`;

		return await fetch(endpointWIthUsername, {
			method: 'GET'
		})
			.then(async (response) => {
				return response.json();
			})
			.catch((error) => {
				console.error('Error fetching CSV data:', error);
			});
	},

	async uploadToDo(text, username) {
		let bodyToSend = {
			text: text,
			action: 'CREATE',
			username: username
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
				return response.json();
			})
			.catch((error) => {
				console.log(error);
			});
	},

	async updateToDo(id, username) {
		let bodyToSend = {
			id: id,
			action: 'UPDATE',
			username: username
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

	async removeToDo(id, username) {
		let bodyToSend = {
			id: id,
			action: 'DELETE',
			username: username
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
