import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { BookingCard } from './BookingCard';

import * as actions from 'actions';

class BookingManage extends React.Component {

	//componentWillMount() {
	UNSAFE_componentWillMount() {
		this.props.dispatch(actions.fetchUserBookings());
	}

	renderBookings(bookings) {
		if (bookings) {
			return bookings.map((booking, index) =>
				<BookingCard booking={ booking } key={ index } />);
		}
	}

	render() {
		const { data: bookings, isFetching } = this.props.userBookings;

		return (
			<section id='userBookings'>
				<h1 className='page-title'>My Bookings</h1>
				<div className='row'>
					{ this.renderBookings(bookings) }
				</div>
				{ !isFetching && bookings.length === 0 &&
					<div className='alert alert-warning'>
						You have no bookings created go to rentals section&nbsp;
						and book your place today.
						<Link style={{'marginLeft': '10px'}} className='btn btn-bwm'
							to='/rentals'>Available Rental</Link>
					</div>
				}
			</section>

		);
	}
}

function mapStateToProps(state) {
	return {
		userBookings: state.userBookings
	}
}

export default connect(mapStateToProps)(BookingManage);
