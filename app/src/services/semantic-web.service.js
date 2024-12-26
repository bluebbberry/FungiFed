// Define a class for interacting with the semantic web using SPARQL
class SemanticWebService {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    // Function to send a SPARQL query and retrieve results
    async fetchSPARQLResults(query) {
        const url = `${this.endpoint}?query=${encodeURIComponent(query)}`;

        const headers = {
            "Accept": "application/sparql-results+json"
        };

        try {
            const response = await fetch(url, { headers });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.results.bindings;
        } catch (error) {
            console.error("Error fetching SPARQL results:", error);
            return [];
        }
    }
}

// Define the SPARQL query
const query = `
  SELECT ?label
  WHERE {
    dbr:JavaScript rdfs:label ?label .
    FILTER (lang(?label) = "en")
  }
  LIMIT 10
`;

// Process and display the results
async function main() {
    const service = new SemanticWebService("https://dbpedia.org/sparql");
    const results = await service.fetchSPARQLResults(query);

    if (results.length > 0) {
        console.log("SPARQL Query Results:");
        results.forEach((result, index) => {
            console.log(`${index + 1}: ${result.label.value}`);
        });
    } else {
        console.log("No results found.");
    }
}

// Run the script
main();
