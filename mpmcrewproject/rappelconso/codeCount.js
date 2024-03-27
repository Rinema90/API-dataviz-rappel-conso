   .then(data => {
        console.log(data)
        console.log("results with dict", data.results[0]["count(*)"])
        const newResults = {}
        data.results.forEach(item => {
            const categorie = item['categorie_de_produit'];
            const count = item['count(*)'];
            newResults[categorie] = count;
        });
    }
        console.log("newResults", newResults);