import "./SearchBox.css";

type SearchBoxProps = {
    activeTab: string;
    query: string;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
};

function SearchBox({
    activeTab,
    query,
    onQueryChange,
    onSearch,
}: SearchBoxProps) {
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

            <button
                type="button"
                onClick={onSearch}
            >
                Search
            </button>
        </div>
    );
}

export default SearchBox;