import axios from 'axios';
import authService from 'services/auth-service';
import axiosService from 'services/axios-service';

import { FETCH_RENTAL_BY_ID, FETCH_RENTAL_BY_ID_INIT,
	FETCH_RENTALS_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE,
	LOGOUT, FETCH_RENTALS_INIT, FETCH_RENTALS_FAIL,
	FETCH_USER_BOOKINGS_SUCCESS, FETCH_USER_BOOKINGS_FAIL,
	FETCH_USER_BOOKINGS_INIT, UPDATE_RENTAL_SUCCESS, UPDATE_RENTAL_FAIL,
	RESET_RENTAL_ERRORS, RELOAD_MAP, RELOAD_MAP_FINISH }
	from './types';

const axiosInstance = axiosService.getInstance();

export const verifyRentalOwner = (rentalId) => {
	return axiosInstance.get(`/rentals/${rentalId}/verify-user`);
}

export const reloadMap = () => {
	return {
		type: RELOAD_MAP
	}
}

export const reloadMapFinish = () => {
	return {
		type: RELOAD_MAP_FINISH
	}
}

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

const fetchRentalsInit = () => {
	return {
		type: FETCH_RENTALS_INIT
	}
}

const fetchRentalsFail = (errors) => {
	return {
		type: FETCH_RENTALS_FAIL,
		errors
	}
}

export const fetchRentals = (city) => {
	const url = city ? `/rentals?city=${city}` : '/rentals';

	return dispatch => {
		dispatch(fetchRentalsInit());

		axiosInstance.get(url)
			.then(res => res.data)
			.then(rentals => dispatch(fetchRentalsSuccess(rentals)))
			.catch(({response}) =>
				dispatch(fetchRentalsFail(response.data.errors)));
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

export const createRental = (rentalData) => {
	return axiosInstance.post('/rentals', rentalData).then(
		(res) => {
			//console.log('create: ', res);
			return res.data;
		},
		(err) => {
			return Promise.reject(err.response.data.errors);
		});
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

export const resetRentalErrors = () => {
	return {
		type: RESET_RENTAL_ERRORS
	}
}

const updateRentalSuccess = (updatedRental) => {
	return {
		type: UPDATE_RENTAL_SUCCESS,
		rental: updatedRental
	}
}

const updateRentalFail = (errors) => {
	return {
		type: UPDATE_RENTAL_FAIL,
		errors
	}
}

export const updateRental = (id, rentalData) => dispatch => {
	return axiosInstance.patch(`/rentals/${id}`, rentalData)
		.then(res => res.data)
		.then(updatedRental => {
			dispatch(updateRentalSuccess(updatedRental));

			if (rentalData.city || rentalData.street) {
				dispatch(reloadMap());
			}
		})
		.catch(({ response}) =>
			dispatch(updateRentalFail(response.data.errors))
		);
}

const fetchUserBookingsInit = () => {
	return {
		type: FETCH_USER_BOOKINGS_INIT
	}
}

const fetchUserBookingsSuccess = (userBookings) => {
	return {
		type: FETCH_USER_BOOKINGS_SUCCESS,
		userBookings
	}
}

const fetchUserBookingsFail = (errors) => {
	return {
		type: FETCH_USER_BOOKINGS_FAIL,
		errors
	}
}

export const fetchUserBookings = () => {
	return dispatch => {
		dispatch(fetchUserBookingsInit());

		axiosInstance.get('/bookings/manage')
			.then(res => res.data)
			.then(userBookings => {
				//console.log('bookings:', userBookings);
				return dispatch(fetchUserBookingsSuccess(userBookings))
			})
			.catch(({response}) =>
				dispatch(fetchUserBookingsFail(response.data.errors)));
	}
}

export const getUserRentals = () => {
	return axiosInstance.get('/rentals/manage').then(
		(res) => {
			return res.data;
		},
		(err) => {
			return Promise.reject(err.response.data.errors);
		});
}

export const deleteRental = (rentalId) => {
	return axiosInstance.delete(`/rentals/${rentalId}`).then(
		res => res.data,
		err => Promise.reject(err.response.data.errors)
	);
}

const loginSuccess = () => {
	const username = authService.getUsername();

	return {
		type: LOGIN_SUCCESS,
		username
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
