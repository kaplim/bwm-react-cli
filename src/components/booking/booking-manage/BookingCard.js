import React from 'react';
import { Link } from 'react-router-dom';

import { prettifyDate, toUpperCase } from 'helpers';

export function BookingCard(props) {

	const { booking } = props;

	return(
		<div className='col-md-4'>
			<div className='card text-center'>
				<div className='card-header'>
					{ booking.rental ?
						booking.rental.category :
						'Deleted Rental'
					}
				</div>
				<div className='card-block'>
					{ booking.rental &&
						<div>
							<h4 className='card-title'>
								{ booking.rental.title } -&nbsp;
								{toUpperCase(booking.rental.city)}
							</h4>
							<p className='card-text booking-desc'>
								Rental Description</p>
						</div>
					}
					<p className='card-text booking-days'>
						{ prettifyDate(booking.startAt) } -&nbsp;
						{ prettifyDate(booking.endAt) }
						&nbsp;| { booking.days } days</p>
					<p className='card-text booking-price'>
						<span>Price: </span>
						<span className='booking-price-value'>
							$ { booking.totalPrice }</span>
					</p>
					{ booking.rental &&
						<Link className='btn btn-bwm'
							to={`/rentals/${booking.rental._id}`}>
							Go to Rental</Link>
					}
				</div>
				<div className='card-footer text-muted'>
					Created { prettifyDate(booking.createdAt) }
				</div>
			</div>
		</div>
	);
}