import "./SearchBox.css";

type SearchBoxProps = {
    activeTab: string;
};

function SearchBox({ activeTab }: SearchBoxProps) {
    return (
        <div className="search-box">
            <input
                type="text"
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