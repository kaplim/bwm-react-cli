const Rental = require('../models/rental');
const User = require('../models/user');
const Booking = require('../models/booking');
const { normalizeErrors } = require('../helpers/mongoose');
const moment = require('moment');

exports.createBooking = function(req, res) {
	const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
	const user = res.locals.user;

	const booking = new Booking({ startAt, endAt, totalPrice, guests, days });

	Rental.findById(rental._id)
		.populate('bookings')
		.populate('user')
		.exec(function(err, foundRental) {
			if (err) {
				return res.status(422).send({
					errors: normalizeErrors(err.errors)
				});
			}
			if (foundRental.user.id === user.id) {
				return res.status(422).send({ errors: [{
					title: 'Invalid user',
					detail: 'Cannot create booking on your rental'
				}]});
			}

			if (isValidbooking(booking, foundRental)) {

				booking.user = user;
				booking.rental = foundRental;
				foundRental.bookings.push(booking);

				booking.save(function(err) {
					if (err) {
						return res.status(422).send({
							errors: normalizeErrors(err.errors)
						});
					}
					foundRental.save();
					User.update({ _id: user.id }, { $push: { bookings: booking } },
						function() {});

					return res.json({
						'startAt': booking.startAt,
						'endAt': booking.endAt
					});
				});
			}
			else {
				return res.status(422).send({ errors: [{
					title: 'Invalid booking',
					detail: 'Chosen dates are already taken'
				}]});
			}
		});
}

function isValidbooking(pendingBooking, rental) {
	let isValid = true;

	if (rental.bookings && rental.bookings.length > 0) {
		isValid = rental.bookings.every(function(booking) {
			const pendingStart = moment(pendingBooking.startAt);
			const pendingEnd = moment(pendingBooking.endAt);

			const actualStart = moment(booking.startAt);
			const actualEnd = moment(booking.endAt);

			return ((actualStart < pendingStart && actualEnd < pendingEnd) ||
				(pendingEnd < actualEnd && pendingEnd < actualStart));
		});
	}
	return isValid;
}