import { useState, useEffect, useRef, useCallback } from "react";
import Map from "react-map-gl";
import { Select, MenuItem } from "@material-ui/core";
import MapboxCompare from "mapbox-gl-compare";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import "./styles.css";
import React from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGV2MDUxMCIsImEiOiJjbGNoaG41czEwYmxuM3FtOWNvemVub3lkIn0.5hN1wrZNfw-7YmnNYKM2YQ";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGV2MDUxMCIsImEiOiJjbGNoaG41czEwYmxuM3FtOWNvemVub3lkIn0.5hN1wrZNfw-7YmnNYKM2YQ";
export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 29.2811,
    longitude: 79.2925,
    zoom: 14
  });
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );
  const beforeRef = useRef();
  const afterRef = useRef();
  // const map = useRef(null);
  const style: React.CSSProperties = {
    position: "absolute",

    left: 0,
    width: "100%"
  };
  const [lng, setLng] = useState(79.2925);
  const [lat, setLat] = useState(29.2811);
  const [legendarray, changelengendarray] = useState([]);
  const [styleurl, changeurl] = useState(
    "mapbox://styles/dev0510/cle5cyqqj001401q921cucm3o"
  );
  const [styleurl2, changeurl2] = useState(
    "mapbox://styles/dev0510/cle5dg0ad005x01mt2d8phfe3"
  );

  const [values, setValues] = React.useState([
    "haldwani 2018",
    "haldwani 2022",
    "dibrugarh",
    "eg 2",
    "eg 3"
  ]);
  const [selected, setSelected] = useState("haldwani 2018");
  const [selected2, setSelected2] = useState("haldwani 2022");
  const [urls, seturls] = useState({
    "haldwani 2018": "mapbox://styles/dev0510/cle5cyqqj001401q921cucm3o",
    "haldwani 2022": "mapbox://styles/dev0510/cle5dg0ad005x01mt2d8phfe3"
  });

  function handleChange(event) {
    setSelected(event.target.value);
    changemap(event.target.value);
  }
  function handleChange1(event) {
    setSelected2(event.target.value);
    changemap1(event.target.value);
  }

  function changemap(mapname) {
    // console.log(mapname);
    changeurl(urls[mapname]);
  }
  function changemap1(mapname) {
    // console.log(mapname);
    changeurl2(urls[mapname]);
  }

  useEffect(() => {
    const beforeMap = new mapboxgl.Map({
      container: "before", // Container ID
      style: styleurl,
      center: [lng, lat],
      zoom: 14
    });
    const afterMap = new mapboxgl.Map({
      container: "after", // Container ID
      style: styleurl2,
      center: [lng, lat],
      zoom: 14
    });
    beforeMap.on("load", () => {
      beforeMap.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxZoom: 16
      });
      beforeMap.setTerrain({ source: "mapbox-dem" });
      if (beforeMap.getLayer("haldwani")) {
        const gg = beforeMap.getLayer("haldwani").paint._values["fill-color"]
          .value._styleExpression.expression.outputs;
        console.log("the value of gg", gg);
        changelengendarray(gg);
        console.log("djasdghas", legendarray);
      }
      //the array for legend colour
    });
    afterMap.on("load", () => {
      afterMap.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxZoom: 16
      });
      afterMap.setTerrain({ source: "mapbox-dem" });
    });

    const map = new MapboxCompare(
      beforeMap,
      afterMap,
      "#comparison-container",
      {
        mousemove: false
      }
    );

    return () => map.remove();
  }, [styleurl, styleurl2]);

  return (
    <>
      <div className="controls">
        Choose map {/* <button onClick={changemap}> map </button> */}
        <Select value={selected} onChange={handleChange}>
          {values.map((value, index) => {
            return <MenuItem value={value}>{value}</MenuItem>;
          })}
        </Select>
        <Select value={selected2} onChange={handleChange1}>
          {values.map((value, index) => {
            return <MenuItem value={value}>{value}</MenuItem>;
          })}
        </Select>
      </div>
      <div className="legend-controls">
        {/* {legendarray.map((value, index) => {
            return <MenuItem value={value}>{value}</MenuItem>;
          })} */}
        <span className="legend-labels">
          {" "}
          gridcode 1<div className="legend-colors"></div>
        </span>
        <span> gridcode 2</span>
      </div>
      <div id="comparison-container" style={{ ...style, width: "100%" }}>
        {/* <div id="before"></div>
      <div id="after"></div> */}

        <Map
          id="before"
          // ref={beforeRef}
          {...viewport}
          onMove={handleViewportChange}
          style={style}
          mapStyle="mapbox://styles/dev0510/cle5cyqqj001401q921cucm3o"
          mapboxAccessToken={MAPBOX_TOKEN}
        />

        <Map
          id="after"
          // ref={afterRef}
          {...viewport}
          onMove={handleViewportChange}
          style={style}
          mapStyle="mapbox://styles/dev0510/cle5dg0ad005x01mt2d8phfe3"
          mapboxAccessToken={MAPBOX_TOKEN}
        />
      </div>
    </>
  );
}
