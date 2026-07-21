import { useState } from "react";
import SearchBox from "../components/SearchBox/SearchBox";

function Buy() {
  const [query, setQuery] = useState("");

  function handleSearch() {
    console.log(query);
  }

  return (
    <main className="buy-page">
      <h1>Properties for Sale</h1>

      <section>
        <SearchBox
          activeTab="buy"
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />
      </section>

      <section>
        Filters
      </section>

      <section>
        Map
      </section>

      <section>
        Property List
      </section>

      <section>
        Load More
      </section>
    </main>
  );
}

export default Buy;