import "./SearchTabs.css";

type SearchTabsProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
    return (
        <div className="search-tabs">
            <button
                type="button"
                onClick={() => onTabChange("buy")}
                className={
                    activeTab === "buy"
                        ? "search-tabs__button search-tabs__button--active"
                        : "search-tabs__button"
                }
            >
                Buy
            </button>

            <button
                type="button"
                onClick={() => onTabChange("rent")}
                className={
                    activeTab === "rent"
                        ? "search-tabs__button search-tabs__button--active"
                        : "search-tabs__button"
                }
            >
                Rent
            </button>
        </div>
    );
}

export default SearchTabs;