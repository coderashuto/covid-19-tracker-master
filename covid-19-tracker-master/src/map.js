import React from "react";
import './Map.css';
import { showDataOnMap } from './util';
import { Map as LeafletMap, TileLayer } from "react-leaflet";

function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      {/* <h1>Hello, I'm a Map</h1> */}
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* loop through and draw pointers on the map */}
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
