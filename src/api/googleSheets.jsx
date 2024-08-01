import { CONSTANTS } from '../constants/CONSTANTS';
import axios from 'axios';

const GoogleSheetsService = {
	async fetchSpreadsheet() {
		return await axios
			.get(CONSTANTS.GOOGLE_SHEET_SCRIPT, {})
			.then(async (response) => {
				return response.data.data;
			})
			.catch((error) => {
				console.error('Error fetching CSV data:', error);
			});
	},

	async uploadToDo(todo) {
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
	}
};

export default GoogleSheetsService;
