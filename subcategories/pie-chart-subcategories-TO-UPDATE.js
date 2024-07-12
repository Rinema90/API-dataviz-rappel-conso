fetch('https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso0/records?select=count(*)&group_by=sous_categorie_de_produit&limit=100&refine=date_de_publication%3A2024&refine=categorie_de_produit%3A%22Alimentation%22')
    // pour limiter à l'anée 2024, ajouter à l'URL : ?refine=date_de_publication:2024
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            console.log(data)
            const newResults = {}
            data.results.forEach(item => {
                const categorie = item['sous_categorie_de_produit'];
                const count = item['count(*)'];
                newResults[categorie] = count;
            });
    
            console.log("newResults", newResults)

            const total = Object.values(newResults).reduce((acc, curr) => acc + curr, 0)
            const percentages = {};
            for (const key in newResults) {
                percentages[key] = ((newResults[key] / total) * 100).toFixed(2) + "%";
            }
    
            console.log("percentages", percentages);

         // Conversion des pourcentages en nombres décimaux
         const percentageEnDecimal = Object.entries(percentages).map(([category, value]) => ({
            category: category,
            value: parseFloat(value.replace('%', ''))
        }));

        //chart = {
            // Specify the chart’s dimensions.
            const width = 928;
            const height = Math.min(width, 500);
          
            // Create the color scale.
            const color = d3.scaleOrdinal()
                .domain(percentageEnDecimal.map(d => d.name))
                .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), percentageEnDecimal.length).reverse())
          
            // Create the pie layout and arc generator.
            const pie = d3.pie()
                .sort(null)
                .value(d => d.value);
          
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(Math.min(width, height) / 2 - 1);
          
            const labelRadius = arc.outerRadius()() * 0.8;
          
            // A separate arc generator for labels.
            const arcLabel = d3.arc()
                .innerRadius(labelRadius)
                .outerRadius(labelRadius);
          
            const arcs = pie(percentageEnDecimal);
          
            // Create the SVG container.
            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
          
            // Add a sector path for each value.
            svg.append("g")
                .attr("stroke", "white")
              .selectAll()
              .data(arcs)
              .join("path")
                .attr("fill", d => color(d.percentageEnDecimal.name))
                .attr("d", arc)
              .append("title")
                .text(d => `${d.percentageEnDecimal.name}: ${d.percentageEnDecimal.value.toLocaleString("en-US")}`);
          
            // Create a new arc generator to place a label close to the edge.
            // The label shows the value if there is enough room.
            svg.append("g")
                .attr("text-anchor", "middle")
              .selectAll()
              .data(arcs)
              .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                .call(text => text.append("tspan")
                    .attr("y", "-0.4em")
                    .attr("font-weight", "bold")
                    .text(d => d.percentageEnDecimal.name))
                .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                    .attr("x", 0)
                    .attr("y", "0.7em")
                    .attr("fill-opacity", 0.7)
                    .text(d => d.percentageEnDecimal.value.toLocaleString("en-US")));
          
            return svg.node();
          }
    )
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });