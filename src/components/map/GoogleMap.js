import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  //Marker,
  Circle,
  InfoWindow
} from "react-google-maps";
import { Cacher } from 'services/cacher';

function MapComponent(props) {

  const { coordinates, isError, isLocationLoaded } = props;

  return (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={coordinates}
      center={coordinates}
      options={{ disableDefaultUI: isError ? true : false }}
    >
      { isLocationLoaded && !isError &&
        <Circle center={coordinates} radius={500} />}
      { isLocationLoaded && isError &&
        <InfoWindow position={ coordinates } options={{ maxWidth: 300 }}>
        <div>
    Uuuups, there is a problem to find location on the map. We are trying
    to resolve this problem as fast as possible. Contact host for additional
    info if you are still interested in this place. We are sorry for the
    inconvinience.
        </div> 
      </InfoWindow>}
    </GoogleMap>
  );
}

function withGeocode(WrappedComponent) {
  return class extends React.Component {

    constructor() {
      super();

      this.cacher = new Cacher();

      this.state = {
        coordinates: { lat: 0, lng: 0 },
        isError: false,
        isLocationLoaded: false
      }
    }

    //componentWillMount() {
    UNSAFE_componentWillMount() {
      this.getGeocodedLocation();
    }

    componentDidUpdate() {
      if (this.props.isReloading) {
        this.getGeocodedLocation();
      }
    }
    
    updateCoordinates(coordinates) {
      this.props.mapLoaded();

      this.setState({
        coordinates,
        isLocationLoaded: true
      });
    }

    geocodeLocation(location) {
      const geocoder = new window.google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({}, (result, status) => {
          if (status === 'OK') {
            const geometry = result[0].geometry.location;
            const coordinates = { lat: geometry.lat(), lng: geometry.lng() };

            this.cacher.cacheValue(location, coordinates);
            
            resolve(coordinates);
          }
          else {
            reject('Error in getting geocode.');
          }
        });
      });
    }

    getGeocodedLocation() {
      const location = this.props.location;
      //let location = this.props.location;
      //if (Math.floor(Math.random() * 10) > 5) location ='4gfdsdgrregrevf';

      if (this.cacher.isValueCached(location)) {
        this.updateCoordinates(this.cacher.getCachedValue(location));
      }
      else {
        this.geocodeLocation(location).then(
          (coordinates) => {
            this.updateCoordinates(coordinates);
          },
          (err) => {
            // For testing, use hard-coded coordinates:
            //const coordinates = { lat: 37.7749, lng: -122.4194 };  // San Francisco
            //this.setState({ coordinates, isError: false, isLocationLoaded: true });

            this.props.mapLoaded();
            
            this.setState({ isError: true, isLocationLoaded: true });
          });
      }
    }

    render() {
      return (
        <WrappedComponent {...this.state}/>
      );
    }
  }
}

export const MapWithGeocode =
  withScriptjs(withGoogleMap(withGeocode(MapComponent)));
