import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import L from "leaflet";

import ethService from '../ethereum';
import "./ParcelsMap.css";

const MAP_ID = "map";

L.Icon.Default.imagePath = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/";

export default class ParcelsMap extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    lat: PropTypes.number,
    lng: PropTypes.number,
    bounds: PropTypes.arrayOf(PropTypes.array),
    zoom: PropTypes.number.isRequired,
    tileSize: PropTypes.number.isRequired,
    center: PropTypes.number,
    onClick: PropTypes.func,
    onMoveEnd: PropTypes.func
  };

  static defaultProps = {
    bounds: [],
    onClick: () => {},
    onMoveEnd: () => {}
  };

  componentWillMount() {
    this.map = null;
    this.marker = null;
  }

  componentWillUnmount() {
    this.removeMap();
  }

  createLeafletElement(container) {
    const { bounds, zoom } = this.props;

    this.map = new L.Map(MAP_ID, {
      center: this.getInitialCenter(),
      minZoom: zoom,
      maxZoom: zoom,
      zoom: zoom,
      layers: [this.getGridLayer()]
    });

    this.map.zoomControl.setPosition("topright");
    this.map.setMaxBounds(point.toLatLngBounds(bounds));

    this.map.on("click", this.onMapClick);
    this.map.on("moveend", this.onMapMoveEnd);

    return this.map;
  }

  onMapClick = (event) => {
    const { x, y } = point.latLngToCartesian(event.latlng);

    this.props.onClick(x, y);
  }

  onMapMoveEnd = (event) => {
    let bounds = {}
    const mapBounds = this.map.getBounds()
    const sw = mapBounds.getSouthWest()
    bounds.min = point.latLngToCartesian(sw)
    const ne = mapBounds.getNorthEast()
    bounds.max = point.latLngToCartesian(ne)
    const position = this.map.getCenter()
    this.props.onMoveEnd({ bounds, position })
  }

  getGridLayer() {
    const { tileSize, parcelData } = this.props;
    const tiles = new L.GridLayer({ tileSize });

    tiles.createTile = createTile.bind(tiles, parcelData);

    return tiles;
  }

  getInitialCenter() {
    const { x, y } = this.props;
    const { lat, lng } = this.props;
    return (!x || isNaN(x)) ? new L.LatLng(lat || 0, lng || 0) : point.cartesianToLatLng({ x, y });
  }

  panTo(x, y) {
    this.map.panTo(point.cartesianToLatLng({ x, y }))
  }

  bindMap(container) {
    if (container) {
      this.removeMap();
      this.createLeafletElement(container);
    }
  }

  removeMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  render() {
    return <div id={MAP_ID} ref={this.bindMap.bind(this)} />;
  }
}

const OFFSET = 1024;

const NO_OWNER = '0x0000000000000000000000000000000000000000'

const formatOwner = owner => owner.substr(2, 4) + '...' + owner.substr(38, 4)
function createTile(parcelData, coords) {
  const tile = L.DomUtil.create("div", "leaflet-tile");
  const x = coords.x - OFFSET
  const y = coords.y - OFFSET

  const unclaimed = "#EAEAEA";
  const own = '#30D7A9';
  const other = '#7FA8FF';
  let color = unclaimed;

  const parcel = parcelData[`${x},${y}`]
  if (parcel) {
    if (parcel.owner !== NO_OWNER) {
      if (parcel.owner === ethService.address) {
        color = own;
      } else {
        color = other;
      }
      ReactDOM.render(<div>
        {x}, {y}
        <br/>
        0x{formatOwner(parcel.owner)}
        <br/>
        content: {parcel.metadata}
      </div>, tile)
    } else {
      tile.innerHTML = `${x}, ${y}, unclaimed`
    }
  } else {
    tile.innerHTML = `${x}, ${y}<br/>loading...`
  }
  const size = this.getTileSize();


  tile.style.width = size.x;
  tile.style.height = size.y;
  tile.style.backgroundColor = color;
  tile.style.border = "1px solid #FFF";

  return tile;
}

const point = {
  toLatLngBounds(bounds) {
    let [lower, upper] = bounds;

    lower = point.cartesianToLatLng({ x: lower[0], y: lower[1] });
    upper = point.cartesianToLatLng({ x: upper[0], y: upper[1] });

    return new L.LatLngBounds(lower, upper);
  },

  cartesianToLatLng({ x, y }) {
    const t = 180;
    const halfTile = 0.08;

    const lat = -y / OFFSET * t - halfTile;
    const lng = x / OFFSET * t + halfTile;

    return new L.LatLng(lat, lng);
  },

  latLngToCartesian({ lng, lat }) {
    const t = 180;
    const halfTile = 0;
    const x = Math.floor((lng + halfTile) * OFFSET / t);
    const y = Math.floor((-lat + halfTile) * OFFSET / t);
    return { x, y };
  }
};
