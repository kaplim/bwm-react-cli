import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import * as actions from 'actions';
import { RentalManageCard } from './RentalManageCard';
import { RentalManageModal } from './RentalManageModal';

export class RentalManage extends React.Component {

	constructor() {
		super();

		this.state = {
			userRentals: [],
			errors: [],
			isFetching: false
		}

		this.deleteRental = this.deleteRental.bind(this);
	}

	//componentWillMount() {
	UNSAFE_componentWillMount() {
		this.setState({ isFetching: true });

		actions.getUserRentals().then(
			userRentals => this.setState({ userRentals, isFetching: false }),
			errors => this.setState({ errors, isFetching: false }));
	}

	renderRentalCards(rentals) {
		if (rentals) {
			return rentals.map((rental, index) =>
				<RentalManageCard key={ index } rental={ rental } 
					modal={ <RentalManageModal bookings={ rental.bookings }/> }
					rentalIndex={ index }
					deleteRentalCb={ this.deleteRental } />
			);
		}
	}

	deleteRental(rentalId, rentalIndex) {
		actions.deleteRental(rentalId).then(
			() => this.deleteRentalFromList(rentalIndex),
			(errors) => toast.error(errors[0].detail)
		);
	}

	deleteRentalFromList(rentalIndex) {
		const userRentals = this.state.userRentals.slice();
		userRentals.splice(rentalIndex, 1);

		this.setState({ userRentals });
	}

	render() {
		const { userRentals, isFetching } = this.state;
		return (
			<section id='userRentals'>
				<ToastContainer />
				<h1 className='page-title'>My Rentals</h1>
				<div className='row'>
					{ this.renderRentalCards(userRentals) }
				</div>
				{ !isFetching && userRentals.length === 0 &&
					<div className='alert alert-warning'>
						You dont have any rentals currenty created.&nbsp;
						If you want advertised your property,&nbsp;
						please follow this link.
						<Link style={{'marginLeft': '10px'}}
							className='btn btn-bwm' to='/rentals/new'>
							Register Rental</Link>
					</div>
				}
			</section>
		);
	}
}


