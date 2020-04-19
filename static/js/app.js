// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  const select_smd = d3.select("#sample-metadata")
  d3.json(`/metadata/${sample}`).then((data) => {
    select_smd
      .html(""); // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      select_smd
        .append("p")
        .text(`${key} ${value}`)
        .property("value", sample);
    });
  });
}

    // Didn't attempt the bonus!
    // I feel like this is the correct code and I am missing one more piece in the map section
    // The data isn't getting rendered. I think it is an issue with passing the correct thing.
    // Please let me know how I can correct this issue in the comment section! 
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


// @TODO: Build a Bubble Chart and Pie Chart
function buildCharts(sample) {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((plotSample) => {
    const select_bubble = d3.select("#bubble")
    const select_pie = d3.select("#pie")
    select_bubble
      .html("");
    select_pie
      .html("");
    Object.entries(plotSample).forEach((plotSampledata) => {
      var trace1 = {
        x: plotSampledata.map( e => e.otu_ids),
        y: plotSampledata.map( e => e.sample_values),
        text: [plotSampledata.map( e => e.otu_labels)],
        mode: 'markers',
        marker: {
          color: [plotSampledata.map( e => e.otu_ids)],
          size: plotSampledata.map( e => e.sample_values)
        }
      };
        
      var plotSampledata = [trace1];
        
      var layout = {
        title: 'Belly Button Sample Bubble Chart',
        showlegend: false,
        height: 600,
        width: 600
      };
        
      Plotly.newPlot('bubble', plotSampledata, layout);
      

      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      var trace2 = {
        values: plotSampledata.map( e => e.sample_values).slice(0,10),
        labels: plotSampledata.map( e => e.otu_ids).slice(0,10),
        hoverinfo: plotSampledata.map( e => e.otu_labels).slice(0,10),
        type: 'pie'
      };
      
      var plotSampledata2 = [trace2];

      var layout2 = {
        height: 400,
        width: 500
      };
      
      Plotly.newPlot('pie', plotSampledata2, layout2);
    });  
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
