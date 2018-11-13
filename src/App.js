import React, { Component } from 'react';
import './App.css';
import { load_google_maps, load_foursquare_places } from './apiCalls'
import Sidebar from './Sidebar'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            venues: []
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
            this.venues = values[1].response.groups[0].items;

            //storing everything from google on the component properties for easier accesing
            this.google = google;
            this.markers = [];
            this.infowindow = new google.maps.InfoWindow();
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: this.venues[0].venue.location.lat, lng: this.venues[0].venue.location.lng},
                zoom: 10,
                scrollwhell: true
            })

            this.venues.forEach(ven => {
            //Creating a marker for each value of the array "venues" in state
                let marker = new google.maps.Marker({
                    position: {
                        lat: ven.venue.location.lat,
                        lng: ven.venue.location.lng
                    },
                    map: this.map,
                    venue: ven,
                    //this id is gonna be used to compare markers and venues
                    id: ven.venue.id,
                    name: ven.venue.name,
                    animation: google.maps.Animation.DROP
                });

                let contentInfowindow = '<div class="info_box">' +
                                        '<h4>' + ven.venue.name + '</h4>' +
                                        '<p>' + ven.venue.location.formattedAddress[0] + '</p>' +
                                        '<p>' + ven.venue.location.formattedAddress[1] + '</p>';

                marker.addListener('click', () => {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                    setTimeout(() => {
                        marker.setAnimation(null)
                    }, 1500);
                });

                google.maps.event.addListener(marker,'click', () => {
                    this.infowindow.setContent(contentInfowindow);
                    this.map.setCenter(marker.position);
                    this.map.setZoom(13);
                    this.infowindow.open(this.map, marker);
                })

                this.markers.push(marker);
            })

            this.setState({ venues:this.venues })

        })
    }

    clickedItem = (ven) => {
        let marker = this.markers.filter(m => m.id === ven.venue.id)[0]
        let contentInfowindow = '<div class="info_box">' +
                                '<h4>' + ven.venue.name + '</h4>' +
                                '<p>' + ven.venue.location.formattedAddress[0] + '</p>' +
                                '<p>' + ven.venue.location.formattedAddress[1] + '</p>';
        this.infowindow.setContent(contentInfowindow);
        this.map.setCenter(marker.position);
        this.infowindow.open(this.map, marker);
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(this.google.maps.Animation.BOUNCE);
        }
        setTimeout(() => {
            marker.setAnimation(null)
        }, 1500);
    }

    filterVenues = (query) => {

        let filteredVenues = this.venues.filter(v => v.venue.name.toLowerCase().includes(query.toLowerCase()))

        this.markers.forEach(m => {
            m.name.toLowerCase().includes(query.toLowerCase()) === true?
            m.setVisible(true) :
            m.setVisible(false)
        })

        this.setState({ venues: filteredVenues, query})
    }


  render() {
    return (
        <div>
            <div id="map"></div>
            <Sidebar
                query = {this.state.query}
                filterVenues= {this.filterVenues}
                venues = {this.state.venues}
                clickedItem = {this.clickedItem}
            />
        </div>

    );
  }
}



export default App;
