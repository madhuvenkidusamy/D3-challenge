// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select scatter class , append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data csv
d3.csv("assets/data/data.csv").then(function(healthData) {
    
  // Print the healthData
  console.log(healthData);

  // Cast the income and obesity to a number
  healthData.forEach(function(data) {
    data.income = +data.income;
    data.obesity = +data.obesity;
    //console.log(data.income);
    //console.log(data.obesity);
  });

  // Configure a linear scale for x and y axes
  var xLinearScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, data => data.income)])
  .range([0, chartWidth]);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, data => data.obesity)])
  .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append an SVG group element to the SVG area, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

  // Append an SVG group element to the SVG area, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis);
  
    

}).catch(function(error) {
  console.log(error);
});