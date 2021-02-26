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
  .domain([d3.min(healthData, data => data.income)-1000, d3.max(healthData, data => data.income)])
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

  // Give x-axis label
  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 15})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Average Income ($)");

  // Give y-axis label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left/2)
    .attr("x", -chartHeight/2)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Obesity (% of Population)");

  // START MAKING CIRCLES
  // make var for state abbreviations
  // var states = healthData.map(data => data.abbr);
  // console.log(states);

  // make circles group
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "10")
    .attr("fill", "purple")
    .attr("opacity", ".4");

  // add labels inside circles
  var textGroup = chartGroup.selectAll("none")
    .data(healthData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("fill", "white")
    .attr("font-size", "10px")
    .attr("x", d => xLinearScale(d.income)-7)
    .attr("y", d => yLinearScale(d.obesity)+5);
    
  // END MAKING CIRCLES
  

  // ADD TOOLTIPS
  // Step 1: Create tooltip class
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) { 
      return (`${d.state}<br>Average Income: $${d.income}<br>Obesity: ${d.obesity}%`)
    }); 

  chartGroup.call(toolTip);
  
  // Create "mouseover" event listener to display tooltip
  textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // Add an onmouseout event to make the tooltip invisible
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    

}).catch(function(error) {
  console.log(error);
});