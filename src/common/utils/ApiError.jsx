export default class ApiError extends Error {
	constructor({ message, statusCode, json }) {
		super(message ?? 'ApiError');

		this.statusCode = statusCode;
		this.name = 'ApiError';
		this.json = json;
	}
}
