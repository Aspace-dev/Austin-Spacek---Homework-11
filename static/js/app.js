// Building metadata panel
function buildMetadata(sample) {
  // Fetching the metadata with d3.json
  d3.json("/metadata/" + sample).then(data => {
    // Selecting panel for sample data
    const BBmetadata = d3.select("#sample-metadata");
    // Clearing previous data
    BBmetadata
      .html("");
    // Appending key value pairs (each with tag) to panel.
    Object.entries(data).forEach(([key, value]) => {
      BBmetadata
        .append("panel")
        .html(key + " : " + value + "<br>");
    });
  });
}

    // Didn't attempt the bonus!
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

// Building Pie Graph and Bubble Chart
function buildCharts(sample) {
  // Fetching the sample data with d3.json
  d3.json("/samples/" + sample).then(data => {
    // Pie Graph
    // Slicing the top ten samples from the sample data
    const graphHt = data.otu_labels.slice(0, 10);
    const graphLabels = data.otu_ids.slice(0, 10);
    const graphValues = data.sample_values.slice(0, 10);

    const graphData = [
      {
        values: graphValues,
        labels: graphLabels,
        hovertext: graphHt,
        type: "pie"
      }
    ];

    const graphLayout = {
      height: 400,
      width: 500,
      title: "Top Ten Samples"
    };

    Plotly.newPlot("pie", graphData, graphLayout);
    
    // Bubble Chart
    const chartData = [
      {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: "markers",
        marker: {
          color: data.otu_ids,
          size: data.sample_values,
          colorscale: "Bluered" // Cool "Bluered" color scale I found on Plotly docs
        }
      }
    ];

    const chartLayout = {
      title: "Samples for each OUT ID",
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: {
          text: "OTU ID"
        }
      },
      yaxis: {
        title: {
          text: "Count of Samples"
        }
      }
    };

    Plotly.newPlot("bubble", chartData, chartLayout);
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
