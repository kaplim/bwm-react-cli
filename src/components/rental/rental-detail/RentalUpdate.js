import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions';

import { toUpperCase } from 'helpers';
// import { RentalDetailInfo } from './RentalDetailInfo';
// import { RentalDetailUpdate } from './RentalDetailUpdate';
import RentalMap from './RentalMap';
import Booking from 'components/booking/Booking';
import { UserGuard } from '../../shared/auth/UserGuard';
import { RentalAssets } from './RentalAssets';
import { EditableInput } from '../../shared/editable/EditableInput';
import { EditableTextArea} from '../../shared/editable/EditableTextArea';
import { EditableSelect} from '../../shared/editable/EditableSelect';
import { EditableImage} from '../../shared/editable/EditableImage';

class RentalUpdate extends React.Component {

	constructor() {
		super();

		this.state = {
			isAllowed: false,
			isFetching: true
		}

		this.updateRental = this.updateRental.bind(this);
		this.resetRentalErrors = this.resetRentalErrors.bind(this);
		this.verifyRentalOwner = this.verifyRentalOwner.bind(this);
	}
	
	//componentWillMount() {
	UNSAFE_componentWillMount() {
		const rentalId =  this.props.match.params.id;

		this.props.dispatch(actions.fetchRentalById(rentalId));
	}

	componentDidMount() {
		// const { isUpdate } = this.props.location.state || false;

		// if (isUpdate) 
			this.verifyRentalOwner();
	}

	verifyRentalOwner() {
		const rentalId =  this.props.match.params.id;
		this.setState({ isFetching: true });

		return actions.verifyRentalOwner(rentalId).then(
			() => {
				this.setState({ isAllowed: true, isFetching: false })
			},
			() => {
				this.setState({ isAllowed: false, isFetching: false })
			});
	}

	updateRental(rentalData) {
		//console.log(rentalData);
		const { rental: { _id }, dispatch } = this.props;

		dispatch(actions.updateRental(_id, rentalData));
	}

	resetRentalErrors() {
		this.props.dispatch(actions.resetRentalErrors());
	}

	render() {
		const { rental, errors } = this.props;
		const { isAllowed, isFetching } = this.state;

		if (rental._id) {
			return (
				<UserGuard isAllowed={ isAllowed } isFetching={ isFetching } >

				<section id='rentalDetails'>
					<div className='upper-section'>
						<div className='row'>
							<div className='col-md-6'>
								<EditableImage entity={ rental }
									entityField={ 'image' }
									errors={ errors }
									updateEntity={ this.updateRental }
								/>
							</div>
							<div className='col-md-6'>
								<RentalMap location=
									{ `${rental.city}, ${rental.street}` }/>
							</div>
						</div>
					</div>

					<div className='details-section'>
						<div className='row'>
							<div className='col-md-8'>

			<div className='rental'>
				<label
					className={`rental-label rental-type ${rental.category}`}>
					Shared</label>
				<EditableSelect entity={ rental }
					entityField={ 'shared' }
					className={ `rental-type ${rental.category}` }
					containerStyle={ { 'display': 'inline-block' } }
					updateEntity={ this.updateRental }
					options={ [true, false] }
					errors={errors}
					resetErrors={ this.resetRentalErrors } />

				<EditableSelect entity={ rental }
					entityField={ 'category' }
					className={ `rental-type ${rental.category}` }
					updateEntity={ this.updateRental }
					options={ ['apartment', 'house', 'condo'] }
					errors={errors}
					resetErrors={ this.resetRentalErrors } />

				<div className='rental-owner'>
					<img src='https://api.adorable.io/avatars/285/abott@adorable.png'
						alt='owner'/>
					<span>{rental.user && rental.user.username}</span>
				</div>

				<EditableInput entity={ rental } entityField={ 'title' }
					className={ 'rental-title' }
					updateEntity={ this.updateRental }
					errors={errors}
					resetErrors={ this.resetRentalErrors } />

				<EditableInput entity={ rental } entityField={ 'city' }
					className={ 'rental-city' }
					updateEntity={ this.updateRental }
					errors={errors}
					resetErrors={ this.resetRentalErrors }
					formatPipe={ [ toUpperCase ] } />

				<EditableInput entity={ rental } entityField={ 'street' }
					className={ 'rental-street' }
					updateEntity={ this.updateRental }
					errors={errors}
					resetErrors={ this.resetRentalErrors } />

				<div className='rental-room-info'>
					<span><i className='fa fa-building'></i>
						<EditableInput entity={ rental }
							entityField={ 'bedrooms' }
							className={ 'rental-bedrooms' }
							containerStyle={ { 'display': 'inline-block' } }
							updateEntity={ this.updateRental }
							errors={errors}
							resetErrors={ this.resetRentalErrors } />
						bedrooms
					</span>&nbsp;&nbsp;
					<span><i className='fa fa-user'></i>
						&nbsp;{rental.bedrooms + 4} guests
					</span>&nbsp;&nbsp;
					<span><i className='fa fa-bed'></i>
						&nbsp;{rental.bedrooms + 2} beds
					</span>
				</div>
				<EditableTextArea entity={ rental }
					entityField={ 'description' }
					className={ 'rental-description' }
					updateEntity={ this.updateRental }
					rows={ 6 } cols={ 50 }
					errors={errors}
					resetErrors={ this.resetRentalErrors } />
				<hr></hr>
				<RentalAssets />
			</div>

							</div>
							<div className='col-md-4'>
								<Booking rental={ rental } />
							</div>
						</div>
					</div>
				</section>

				</UserGuard>
			);
		}
		else {
			return (
				<div>
					<h1>Loading...</h1>
				</div>
			);
		}
	}
}

function mapStateToProps(state) {
	return {
		rental: state.rental.data,
		errors: state.rental.errors
	}
}

export default connect(mapStateToProps)(RentalUpdate)

