// Create the plotting function
function plotting(sampleID) {

    // Read in samples.json
    d3.json("samples.json").then(function (data) {
        
        // Filter the data
        let sampleData = data.samples.filter(i => i.id == sampleID)[0];
  
        // Set the metrics for the bar plot
        let trace1 = {
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(otu_id => `OTU #${otu_id}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        let dataBar = [trace1];

        let layoutBar = { title: "<b>Top 10 OTUs for the Selected Subject ID</b>" ,
         width: 480, height: 640
        };

        // Invoke the bar plot creating function
        Plotly.newPlot("bar", dataBar, layoutBar);

        // Set the metrics for the bubble plot
        let trace2 = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            },
            text: sampleData.otu_labels,
            
        };

        let dataBubble = [trace2];

        let layoutBubble = { title: "<b>Sample Bubble Chart</b>",
            xaxis: {title: "<b>OTU ID</b>"},
            height: 600,
            width: 1200
    };

        // Invoke the bubble plot creating function
        Plotly.newPlot("bubble", dataBubble, layoutBubble);

    });
};


// Create the demographic info box
function demographicInfo(sampleID) {
    let boxData = d3.select("#sample-metadata");
    d3.json("samples.json").then(function (data) {
        let boxData = data.metadata.filter(x => x.id == sampleID)[0];
        d3.select("#sample-metadata").html("");
        Object.entries(boxData).forEach(element => {
            d3.select("#sample-metadata").append("h6").text(`${element[0]}: ${element[1]}`)
        });

    });
}


// Create optionChanged function to update the plots for the selected ID
function optionChanged(sampleID) {
    plotting(sampleID);
    demographicInfo(sampleID);
    gaugePlot(sampleID)
};

// Generate the info for the dropdown
function dropDown() {
    let dropdown = d3.select("#selDataset");
    d3.json("samples.json").then(function (data) {
        let IDs = data.names;
        IDs.forEach(ID => {
            dropdown.append("option").text(ID).property("value", ID)
        });
    });
};


// BONUS PART: GAUGE PLOT
// Generate the gauge plot
function gaugePlot(sampleID) {
    d3.json("samples.json").then(function (data) {
        let sampleMetadata = data.metadata.filter(i => i.id == sampleID)[0];
        // Set the metrics for the gauge plot
        let dataGauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: sampleMetadata.wfreq,
                title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [0, 9] },
                steps: [
                   { range: [0, 1], color: "#FFFFFF" },
                   { range: [1, 2], color: "#FFF5EE" },
                   { range: [2, 3], color: "#F0FFF0" },
                   { range: [3, 4], color: "#F0E68C" },
                   { range: [4, 5], color: "#9ACD32" },
                   { range: [5, 6], color: "#8FBC8F" },
                   { range: [6, 7], color: "#6B8E23" },
                   { range: [7, 8], color: "#556B2F" },
                   { range: [8, 9], color: "#006400" }
                         
                 ], }
            }
        ];

        let layoutGauge = { width: 480, height: 640, margin: { t: 0, b: 0 } };

        // Invoke the gauge plot creating function
        Plotly.newPlot("gauge", dataGauge, layoutGauge);
    });
};

// Populate the plots
function createPlots() {

    d3.json("samples.json").then(function (data) {
        let IDs = data.names[0];
        plotting(IDs);
        demographicInfo(IDs);
        gaugePlot(IDs);
        dropDown();
    });
};

createPlots();