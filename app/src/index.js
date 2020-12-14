import "core-js/stable";
import "regenerator-runtime/runtime";
import "whatwg-fetch";
import "./style.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import Projection from "ol/proj/Projection";
import {register} from "ol/proj/proj4";
import {getTopLeft} from "ol/extent";
import proj4 from "proj4";
import TileLayer from "ol/layer/Tile";
import TileGrid from "ol/tilegrid/TileGrid";
import XYZ from "ol/source/XYZ";
import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import {applyStyle} from "ol-mapbox-style";

const projection = rd();
const tileGrid = dutchTileGrid();

const map = initializeMap(projection, tileGrid);

const backgroundMap = pdokGrayMap(projection, tileGrid);
const overlay = owObjectLayer(projection, tileGrid);

// ------------------------------------------------------
// Uncomment the following line to see PDOK reference map
// ------------------------------------------------------
// map.addLayer(backgroundMap);
//-------------------------------------------------------

fetch("/data/topo_rd_direct.json").then(function(response) {
  response.json().then(function(glStyle) {
    applyStyle(overlay, glStyle, [
      "water",
      "built_up_areas",
      "terrain",
      "roadside",
      "water_line",
      "infrastructure_road-casing",
      "infrastructure_road-fill",
      "infrastructure_pedestrian-casing",
      "infrastructure_pedestrian-fill",
      "infrastructure_bridge",
      "railways",
      "railways-hatching",
      "buildings",
      "courtyards",
      "smallstreets-outline",
      "regionalroads-outline",
      "mainroads-outline",
      "smallstreets-fill",
      "regional-roads-fill",
      "mainroads-fill",
      "motorway-fill",
      "names",
      "house_numbers"
    ]).then(function() {
       map.addLayer(overlay);
    });
  });
});

function rd() {
  proj4.defs("EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
  )
  register(proj4);

  const projection = new Projection({
    code: "EPSG:28992",
    units: "m",
    extent: [-285401.920, 22598.080,  595401.9199999999, 903401.9199999999]
  });

  return projection;
}

function dutchTileGrid() {
  return new TileGrid({
    extent: [-285401.920, 22598.080,  595401.9199999999, 903401.9199999999],
    resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210, 0.105,0.0525],
  });
}

function initializeMap(projection, tileGrid) {
  return new Map({
    target: document.body,
    view: new View({
      center: [122805,487728], // Amsterdam
      extent: tileGrid.getExtent(),
      constrainResolution: true,
      projection: projection,
      resolutions: tileGrid.getResolutions(),
      zoom: 10,
      minZoom: 2,
      maxZoom: 16,
    }),
  });
}

function pdokGrayMap(projection, tileGrid) {
  return new TileLayer({
    source: new XYZ(({
      url: "https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png",
      tileGrid: tileGrid,
      projection: projection,
      origin: getTopLeft(tileGrid.getExtent()),
    })),
  });
}

function owObjectLayer(projection, tileGrid) {
  const maxZoom = 16;
  const source = new VectorTileSource({
    attributions: "<a href='https://www.kadaster.nl' target='_blank'>Kadaster</a>",
    format: new MVT(),
    projection: projection,
    tileGrid: new TileGrid({
      extent: tileGrid.getExtent(),
      origin: getTopLeft(tileGrid.getExtent()),
      resolutions: tileGrid.getResolutions().slice(0, maxZoom + 1),
    }),
    url: "http://localhost:6768/basiskaart_rd/{z}/{x}/{y}.pbf",
    tilePixelRatio: 1,
    renderBuffer: 10
  });
  return new VectorTileLayer({
    source: source,
    declutter: true
   });
}