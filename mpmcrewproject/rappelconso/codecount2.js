    const total = Object.values(newResultsCategorie).reduce((acc, curr) => acc + curr, 0)
        const percentages = {};
        for (const key in newResultsCategorie) {
            percentages[key] = ((newResultsCategorie[key] / total) * 100).toFixed(2) + "%";
        }

        console.log("percentages", percentages);