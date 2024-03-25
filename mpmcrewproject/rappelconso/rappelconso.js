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
        console.log(productCategories.length)
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
}’’’