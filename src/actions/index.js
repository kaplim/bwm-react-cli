import axios from 'axios';
import authService from 'services/auth-service';
import axiosService from 'services/axios-service';

import { FETCH_RENTAL_BY_ID, FETCH_RENTAL_BY_ID_INIT,
	FETCH_RENTALS_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE,
	LOGOUT }
	from './types';

const axiosInstance = axiosService.getInstance();

const fetchRentalByIdInit = () => {
	return {
		type: FETCH_RENTAL_BY_ID_INIT
	}
}

const fetchRentalByIdSuccess = (rental) => {
	return {
		type: FETCH_RENTAL_BY_ID,
		rental: rental
	}
}

const fetchRentalsSuccess = (rentals) => {
	return {
		type: FETCH_RENTALS_SUCCESS,
		rentals
	}
}

export const fetchRentals = () => {
	return dispatch => {
		//axios.get('/api/v1/rentals')
		axiosInstance.get('/rentals')
			.then(res => res.data)
			.then(rentals => dispatch(fetchRentalsSuccess(rentals))
		);
	}
}

export const fetchRentalById = (rentalId) => {
	return function(dispatch) {
		dispatch(fetchRentalByIdInit());
		
		axios.get(`/api/v1/rentals/${rentalId}`)
			.then(res => res.data)
			.then(rental => dispatch(fetchRentalByIdSuccess(rental))
		);
	}
}

export const register = (userData) => {
	return axios.post('/api/v1/users/register', userData).then(
		(res) => {
			//console.log(res.data);
			return res.data;
		},
		(err) => {
			//console.log('res err:', err.response.data.errors);
			return Promise.reject(err.response.data.errors);
		});
}


const loginSuccess = () => {
	return {
		type: LOGIN_SUCCESS
	}
}

const loginFailure = (errors) => {
	return {
		type: LOGIN_FAILURE,
		errors
	}
}

export const checkAuthState = () => {
	return dispatch => {
		if (authService.isAuthenticated()) {
			dispatch(loginSuccess());
		}
	}
}

export const login = (userData) => {
	return dispatch => {
		return axios.post('/api/v1/users/auth', userData)
			.then(res => res.data)
			.then(token => {
				//console.log('auth_token', token)
				authService.saveToken(token);
				dispatch(loginSuccess());
			})
			.catch((error) => {
				//console.log(error.response.data.errors);
				dispatch(loginFailure(error.response.data.errors));
			});
	}
}

export const logout = () => {
	authService.invalidateUser();
	
	return {
		type: LOGOUT
	}
}

export const createBooking = (booking) => {
	return axiosInstance.post('/bookings', booking).then(
		(res) => {
			return res.data;
		},
		// (err) => {
		// 	Promise.reject(err.response.data.errors);
		({response}) => {
			return Promise.reject(response.data.errors);
		});
}
