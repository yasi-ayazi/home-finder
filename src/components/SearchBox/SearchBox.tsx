import "./SearchBox.css";

type SearchBoxProps = {
    activeTab: string;
    query: string;
    onQueryChange: (value: string) => void;
};

function SearchBox({ activeTab,
    query,
    onQueryChange, }: SearchBoxProps) {
    return (
        <div className="search-box">
            <input
                type="text"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}  
                placeholder={
                    activeTab === "buy"
                        ? "Search properties..."
                        : "Search rentals..."
                }
            />

            <button type="button">Search</button>
        </div>
    );
}

export default SearchBox;