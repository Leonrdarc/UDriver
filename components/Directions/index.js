import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
const Directions = ({destination, origin, onReady}) => (
    <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey="AIzaSyCBuuMR1PbJZG-F5DxmGc8AoieUkDASVQI"
    strokeWidth= {4}
    strokeColor="#73477C"
    />
);

export default Directions;
