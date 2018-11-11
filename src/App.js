import React, { Component } from 'react';
import './App.css';
import { load_google_maps, load_foursquare_places } from './apiCalls'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }


    componentDidMount() {
        let googleMapPromise = load_google_maps();
        let foursquarePlacesPromise = load_foursquare_places();

        Promise.all([
            googleMapPromise,
            foursquarePlacesPromise
        ]).then(values => {
            let google = values[0];
            let venues = values[1].response.groups[0].items;

            //storing everything from google on the component properties for easier accesing
            this.google = google;
            this.markers = [];
            this.infowindows = new google.maps.InfoWindow();
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: venues[0].venue.location.lat, lng: venues[0].venue.location.lng},
                zoom: 10,
                scrollwhell: true
            })

            venues.forEach(ven => {
            //Creating a marker for each value of the array "venues" in state
                let marker = new google.maps.Marker({
                    position: {
                        lat: ven.venue.location.lat,
                        lng: ven.venue.location.lng
                    },
                    map: this.map,
                    venue: ven,
                    id: ven.venue.id,
                    name: ven.venue.name,
                    animation: google.maps.Animation.DROP
                });

                let contentInfowindow = `${'<div>' + ven.venue.name + '</div><div>' + ven.venue.location.formattedAddress[0] +
                                    '</div><div>' + ven.venue.location.formattedAddress[1]}`;
                console.log(contentInfowindow)

                google.maps.event.addListener(marker, 'click', function() {
                    this.infowindows.setContent(contentInfowindow)
                    this.infowindows.open(this.map, marker)
                })

                this.markers.push(marker)
            })

        })
    }

    filterVenues(query) {
        this.setState({ query })

        this.markers.forEach(marker => {
            marker.name.toLowerCase().includes(query.toLowerCase()) === true?
            marker.setVisible(true) :
            marker.setVisible(false)
        })
    }


  render() {
    return (
        <div>
            <div id="map"></div>
            <div id="sidebar">
                <input value={this.state.query} onChange={(event) => this.filterVenues(event.target.value)} />
            </div>
        </div>

    );
  }
}



export default App;
