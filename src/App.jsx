import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductList.css";

function App() {
  const [products, setProducts] = useState([]); // All Pokémon
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered Pokémon for display
  const [searchQuery, setSearchQuery] = useState(""); // User input in the search bar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch API on mount
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
        console.log("Pokémon API Response:", response.data.results);
        const pokemons = response.data.results;

        // Fetch details for each Pokémon
        const detailedProducts = await Promise.all(
          pokemons.map(async (pokemon) => {
            const detail = await axios.get(pokemon.url);
            console.log("Detailed Pokémon Data:", detail.data);
            return {
              id: detail.data.id,
              name: detail.data.name,
              image: detail.data.sprites.front_default, // Pokémon image URL
            };
          })
        );

        setProducts(detailedProducts);
        setFilteredProducts(detailedProducts); // Initialize with all products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      console.log("Component unmounted, cleaning up...");
    };
  }, []);

  // Update filtered products when search query changes
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-list-container">
      <h1 className="title">Our Pokemon Cards</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search Pokémon..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
      />
      
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <h2 className="product-title">{product.name}</h2>
          </div>
        ))}
        {filteredProducts.length === 0 && <p>No Pokémon found!</p>}
      </div>
    </div>
  );
}

export default App;
