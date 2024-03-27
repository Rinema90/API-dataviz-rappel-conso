fetch('https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso0/records?limit=100')
    // pour limiter à l'anée 2024, ajouter à l'URL : ?refine=date_de_publication:2024
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let productCategories = showData(data);
        console.log("productCategories", productCategories);
        const counts = {};
        productCategories.forEach((x) => {
            counts[x] = (counts[x] || 0) + 1;

        });
        console.log("counts", counts)

        const margin = { top: 20, right: 30, bottom: 150, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand()
            .domain(Object.keys(counts))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(Object.values(counts))])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("class", "axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(Object.entries(counts))
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d[0]))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d[1]))
            .attr("height", d => height - y(d[1]));


    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

function showData(data) {
    let categories = [];
    data.results.forEach(element => {
        categories.push(element.categorie_de_produit);
    });
    return categories;
}




