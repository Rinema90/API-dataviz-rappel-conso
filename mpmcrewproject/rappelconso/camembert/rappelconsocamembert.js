fetch('https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso0/records?select=count(*)&group_by=sous_categorie_de_produit&limit=100&refine=date_de_publication%3A2024&refine=categorie_de_produit%3A%22Alimentation%22')
    // pour limiter à l'anée 2024, ajouter à l'URL : ?refine=date_de_publication:2024
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
       // .then(data => {
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

   // Largeur et hauteur du graphique
   const width = 600;
   const height = 400;
   const radius = Math.min(width, height) / 2;

   // Créer l'élément SVG
   const svg = d3.select("body").append("svg")
       .attr("width", width)
       .attr("height", height)
       .append("g")
       .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

   // Créer une échelle pour les couleurs
   const color = d3.scaleOrdinal(d3.schemeCategory10);

   // Générer les arcs pour les segments du camembert
   const arc = d3.arc()
       .outerRadius(radius - 10)
       .innerRadius(0);

   // Générer les données pour les éléments path (segments)
   const pie = d3.pie()
       .sort(null)
       .value(d => d.value);

   // Créer les segments du camembert
   const g = svg.selectAll(".arc")
       .data(pie(percentageEnDecimal))
       .enter().append("g")
       .attr("class", "arc");

   // Ajouter les chemins des arcs
   g.append("path")
       .attr("d", arc)
       .style("fill", (d, i) => color(i));

   // Ajouter les étiquettes des segments
   g.append("text")
       .attr("transform", d => "translate(" + arc.centroid(d) + ")")
       .attr("dy", ".35em")
       .text(d => d.data.category);

   // Ajouter un titre
   svg.append("text")
       .attr("x", 0)
       .attr("y", 0 - height / 2 + 20)
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .text("Répartition en pourcentage par catégorie");

    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });