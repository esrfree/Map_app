import React, { Component } from 'react';

class Sidebar extends Component {

    render() {
      return (
          <div id="sidebar">
              <input placeholder="Filter results" value={this.props.query} onChange={(event) => this.props.filterVenues(event.target.value)} />
              {this.props.venues.length > 0 && this.props.venues.map(v => (
                  <div key={v.venue.id} className = "venue-item" onClick={() => this.props.clickedItem(v)}>
                      {v.venue.name}
                  </div>
              ))}
          </div>
      );
    }
}

export default Sidebar;
