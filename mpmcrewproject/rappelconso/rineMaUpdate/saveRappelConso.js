fetch('https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso0/records?select=count(*)&group_by=categorie_de_produit&order_by=count(*)DESC&refine=date_de_publication%3A2024')
    // pour limiter à l'anée 2024, ajouter à l'URL : ?refine=date_de_publication%3A2024
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        const newResultsCategorie = {}
        data.results.forEach(item => {
            const categorie = item['categorie_de_produit'];
            const count = item['count(*)'];
            newResultsCategorie[categorie] = (count);
        });

        console.log("newResultsCategorie", newResultsCategorie);

        const total = Object.values(newResultsCategorie).reduce((acc, curr) => acc + curr, 0)
        const percentages = {};
        for (const key in newResultsCategorie) {
            percentages[key] = ((newResultsCategorie[key] / total) * 100).toFixed(2) + "%";
        }

        console.log("percentages", percentages);

        // Conversion des pourcentages en nombres décimaux
        const percentageEnDecimal = Object.entries(percentages).map(([category, value]) => ({
            category: category,
            value: parseFloat(value.replace('%', ''))
        }));

        // Largeur et hauteur du graphique
        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        // Créer l'élément SVG
        const svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Echelle X
        const x = d3.scaleBand()
            .domain(percentageEnDecimal.map(d => d.category))
            .range([0, width])
            .padding(0.1);

        // Echelle Y
        const y = d3.scaleLinear()
            .domain([0, d3.max(percentageEnDecimal, d => d.value)])
            .range([height, 0]);

        // Créer les barres
        svg.selectAll(".bar")
            .data(percentageEnDecimal)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.category))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value));

        // Ajouter l'axe X
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Ajouter l'axe Y
        svg.append("g")
            .call(d3.axisLeft(y));

        // Ajouter une légende
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Pourcentage");

        // Ajouter un titre
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Répartition en pourcentage par catégorie");

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });