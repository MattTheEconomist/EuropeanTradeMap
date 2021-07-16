let width = 800;
let height = 500;

const countryList = [
  "Belgium",
  "Bulgaria",
  "Czechia",
  "Germany",
  "Denmark",
  "Estonia",
  "Spain",
  "Finland",
  "France",
  "United",
  "Greece",
  "Hungary",
  "Italy",
  "Lithuania",
  "Luxembourg",
  "Latvia",
  "Malta",
  "Netherlands",
  "Pakistan",
  "Poland",
  "Portugal",
  "Romania",
  "Slovenia",
  "Slovakia",
  "Sweden",
  "Austria",
  "Cyprus",
  "Croatia",
  "Ireland",
];

let europeProjection = d3
  .geoMercator()
  .center([13, 52])
  .scale([width / 1.5])
  .translate([width / 2, height / 2]);

/// The path generator uses the projection to convert the GeoJSON
// geometry to a set of coordinates that D3 can understand
let pathGenerator = d3.geoPath().projection(europeProjection);

let geoJsonUrl =
  "https://gist.githubusercontent.com/spiker830/3eab0cb407031bf9f2286f98b9d0558a/raw/7edae936285e77be675366550e20f9166bed0ed5/europe_features.json";

//Create SVG element
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Request the GeoJSON
d3.json(geoJsonUrl, function (geojson) {
  svg
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", pathGenerator)
    .attr("stroke", "grey")
    .attr("fill", "hsla(210, 79%, 67%, 0.68)")
    .on("mouseover", (d) => {});

  d3.json("capitals.json", function (capitals) {
    capitals = capitals.filter((row) => countryList.includes(row.country));

    function radsToDegs(rad) {
      return (rad * 180) / Math.PI;
    }

    function degsToRags(deg) {
      return (deg * Math.PI) / 180.0;
    }

    function createPathCoordinates(orig, dest) {
      orig = capitals.filter((row) => row.country === orig);
      dest = capitals.filter((row) => row.country === dest);

      orig = orig[0];
      dest = dest[0];

      let coordinates = {};

      coordinates["x1"] = europeProjection([orig.longitude, orig.latitude])[0];
      coordinates["y1"] = europeProjection([orig.longitude, orig.latitude])[1];
      coordinates["x2"] = europeProjection([dest.longitude, dest.latitude])[0];
      coordinates["y2"] = europeProjection([dest.longitude, dest.latitude])[1];

      return coordinates;
    }

    function degreeRotationBetweenCoordinates(coordObj) {
      const yDiff = coordObj.y2 - coordObj.y1;
      const xDiff = coordObj.x2 - coordObj.x1;

      const radians = Math.atan2(yDiff, xDiff);

      return radsToDegs(radians);
    }

    const stemWidth = 20;
    const headWidth = stemWidth / 1.45;
    const arrowOpacity = 0.8;
    const hypLength = stemWidth * 1.2;
    const origRadius = 12;

    function topArrowStartingCoordinates(orig, dest) {
      const lineCoords = createPathCoordinates(orig, dest);
      let arrowAngle = degreeRotationBetweenCoordinates(lineCoords);

      let alphaAngle = arrowAngle - 45;
      let betaAngle = 180 - 90 - alphaAngle;

      alphaAngle = degsToRags(alphaAngle);
      betaAngle = degsToRags(betaAngle);

      const verticalDistance = hypLength * Math.sin(alphaAngle);
      const horizontalDistance = hypLength * Math.sin(betaAngle);

      const startingX = lineCoords.x2 - horizontalDistance;
      const startingY = lineCoords.y2 - verticalDistance;

      return { x1: startingX, y1: startingY };
    }

    function bottomArrowStartingCoordinates(orig, dest) {
      const lineCoords = createPathCoordinates(orig, dest);
      const arrowAngle = degreeRotationBetweenCoordinates(lineCoords);

      // const alphaAngle = 270 - arrowAngle;
      let alphaAngle = arrowAngle + 45;
      let betaAngle = 180 - 90 - alphaAngle;

      alphaAngle = degsToRags(alphaAngle);
      betaAngle = degsToRags(betaAngle);

      const verticalDistance = hypLength * Math.sin(alphaAngle);
      const horizontalDistance = hypLength * Math.sin(betaAngle);

      const startingX = lineCoords.x2 - horizontalDistance;
      const startingY = lineCoords.y2 - verticalDistance;

      return { x1: startingX, y1: startingY };
    }

    const origin = "Ireland";
    const destination = "Greece";

    const lineCoords = createPathCoordinates(origin, destination);

    const arrowTopCoords = topArrowStartingCoordinates(origin, destination);
    const arrowBottomCoords = bottomArrowStartingCoordinates(
      origin,
      destination
    );

    console.log(arrowTopCoords, lineCoords);

    let arrowTopXDifference = arrowTopCoords.x1 - lineCoords.x2;
    let arrowTopYDifference = arrowTopCoords.y1 - lineCoords.y2;

    let arrowBottomXDiffernce = arrowBottomCoords.x1 - lineCoords.x2;
    let arrowBottomYDiffernce = arrowBottomCoords.y1 - lineCoords.y2;

    let arrowAngle = degreeRotationBetweenCoordinates(lineCoords);

    console.log("arrowTopYDifference", arrowTopYDifference);
    if (arrowAngle > 180) {
      arrowTopYDifference *= -1;
    }

    console.log("arrowAngle", arrowAngle);
    console.log("arrowTopYDifference", arrowTopYDifference);

    // const arrowAngle

    function createArrow(orig, dest, stemWidth) {
      const lineCoords = createPathCoordinates(origin, destination);

      const arrowTopCoords = topArrowStartingCoordinates(origin, destination);
      const arrowBottomCoords = bottomArrowStartingCoordinates(
        origin,
        destination
      );
    }

    // function arrowStemCurve(lineCoords) {
    //   let x1 = lineCoords.x1;
    //   let y1 = lineCoords.y1;
    //   let y2 = lineCoords.x2;
    //   let x2 = lineCoords.y2;
    //   // let k = (y2 - y1) / 2;
    //   let k1 = 10;
    //   let k2 = k1 + 40;

    //   // const halfWayX = (x2 - x1) / 2;
    //   // const halfWayY = (y2 - y1) / 2;

    //   let path = d3.path();
    //   path.moveTo(x1, y1);
    //   path.bezierCurveTo(x1 + k1, y1 + k1, x1 + k2, y1 + k2, y2, x2); //slight curve

    //   console.log(x1 + k1, y1 + k1, x1 + k2, y1 + k2);
    //   console.log(lineCoords);

    //   return path.toString();
    // }

    svg
      .selectAll("circle")
      .data(capitals)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        // return europeProjection(longitudeFormat(d.Longitude));
        return europeProjection([d.longitude, d.latitude])[0];
      })
      .attr("cy", function (d) {
        // return europeProjection(latitudeFormat(d.Latitude));
        return europeProjection([d.longitude, d.latitude])[1];
      })
      .attr("r", 2)
      .style("fill", "yellow")
      .style("stroke", "gray")
      .style("stroke-width", 0.25)
      .style("opacity", 0.75);

    svg
      .selectAll("text")
      .data(capitals)
      .enter()
      .append("text")
      .attr("x", function (d) {
        // return europeProjection(longitudeFormat(d.Longitude));
        return europeProjection([d.longitude, d.latitude])[0];
      })
      .attr("y", function (d) {
        // return europeProjection(latitudeFormat(d.Latitude));
        return europeProjection([d.longitude, d.latitude])[1] - 10;
      })
      .text((d) => d.capital)
      .style("font-size", "10px");

    svg
      // .select("line")
      .append("line")
      .attr("id", "arrowStem")
      .attr("class", "arrow")
      .attr("x1", lineCoords.x1)
      .attr("y1", lineCoords.y1)
      .attr("x2", lineCoords.x1)
      .attr("y2", lineCoords.y1)
      .style("stroke", "black")
      .style("stroke-width", stemWidth)
      .style("stroke-linecap", "butt") //lol
      .transition()
      .duration(2000)
      .attr("x2", lineCoords.x2)
      .attr("y2", lineCoords.y2);

    // svg
    //   .append("path")
    //   .attr("id", "arrowStem")
    //   .attr("d", arrowStemCurve(lineCoords))
    //   .style("stroke-width", stemWidth)
    //   // .style("stroke-width", 5)
    //   .style("stroke", "black")
    //   .style("fill", "none");

    svg
      .append("line")
      .attr("id", "arrowHeadTop")
      .attr("class", "arrow")
      .attr("x1", lineCoords.x1 + arrowBottomXDiffernce)
      .attr("y1", lineCoords.y1 + arrowBottomYDiffernce)
      .attr("x2", lineCoords.x1)
      .attr("y2", lineCoords.y1)
      .style("stroke", "green")
      .style("stroke-width", headWidth)
      .style("stroke-linecap", "square")
      .transition()
      .duration(2000)
      .attr("x1", arrowBottomCoords.x1)
      .attr("y1", arrowBottomCoords.y1)
      .attr("x2", lineCoords.x2)
      .attr("y2", lineCoords.y2);

    svg
      .append("line")
      .attr("id", "arrowHeadTop")
      .attr("class", "arrow")
      .attr("x1", lineCoords.x1 + arrowTopXDifference)
      .attr("y1", lineCoords.y1 + arrowTopYDifference)
      .attr("x2", lineCoords.x1)
      .attr("y2", lineCoords.y1)
      .style("stroke", "red")
      .style("stroke-width", headWidth)
      .style("stroke-linecap", "square")
      .transition()
      .duration(2000)
      .attr("x1", arrowTopCoords.x1)
      .attr("y1", arrowTopCoords.y1)
      .attr("x2", lineCoords.x2)
      .attr("y2", lineCoords.y2);

    // svg
    //   // .select("line")
    //   .append("line")
    //   .attr("id", "arrowStemSecond")
    //   .attr("class", "arrow")
    //   .attr("x1", lineCoordsSecond.x1)
    //   .attr("y1", lineCoordsSecond.y1)
    //   .attr("x2", lineCoordsSecond.x2)
    //   .attr("y2", lineCoordsSecond.y2)
    //   .style("stroke", "black")
    //   .style("stroke-width", stemWidth - 5)
    //   // .style("stroke-linecap", "square");
    //   // .style("stroke-linecap", "round");
    //   .style("stroke-linecap", "butt"); //lol

    // svg
    //   .append("line")
    //   .attr("id", "arrowHeadTopSecond")
    //   .attr("class", "arrow")
    //   .attr("x1", arrowTopCoordsSecond.x1)
    //   .attr("y1", arrowTopCoordsSecond.y1)
    //   .attr("x2", lineCoordsSecond.x2)
    //   .attr("y2", lineCoordsSecond.y2)
    //   .style("stroke", "black")
    //   .style("stroke-width", headWidth - 5)
    //   .style("stroke-linecap", "square");

    // svg
    //   // .select("line")
    //   .append("line")
    //   .attr("id", "arrowHeadBottomSecond")
    //   .attr("class", "arrow")
    //   // .attr("x1", lineCoords.x2 - 20)
    //   // .attr("y1", lineCoords.y2 + 20)
    //   .attr("x1", arrowBottomCordsSecond.x1)
    //   .attr("y1", arrowBottomCordsSecond.y1)
    //   .attr("x2", lineCoordsSecond.x2)
    //   .attr("y2", lineCoordsSecond.y2)
    //   .style("stroke", "black")
    //   .style("stroke-width", headWidth - 5)
    //   .style("stroke-linecap", "square");

    // svg
    //   // .select("line")
    //   .append("line")
    //   .attr("id", "arrowStemThird")
    //   .attr("class", "arrow")
    //   .attr("x1", lineCoordsThird.x1)
    //   .attr("y1", lineCoordsThird.y1)
    //   .attr("x2", lineCoordsThird.x2)
    //   .attr("y2", lineCoordsThird.y2)
    //   .style("stroke", "black")
    //   .style("stroke-width", stemWidth - 12)
    //   // .style("stroke-linecap", "square");
    //   // .style("stroke-linecap", "round");
    //   .style("stroke-linecap", "butt"); //lol

    svg
      .append("circle")
      .attr("id", "origCircle")
      .attr("cx", lineCoords.x1)
      .attr("cy", lineCoords.y1)
      .attr("r", origRadius)
      .style("fill", "white")
      .style("stroke-width", 4)
      .style("stroke", "black");
  });
});

function longitudeFormat(long) {
  const direction = long.slice(-1);
  long = long.slice(0, -1);
  let longNum = parseFloat(long);

  if (direction === "W") {
    longNum *= -1;
  }
  return longNum;
}

function latitudeFormat(lat) {
  lat = lat.slice(0, -1);
  return parseFloat(lat);
}
