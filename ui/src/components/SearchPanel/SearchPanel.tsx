import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SearchPanel.css";
import SearchTabs from "../SearchTabs/SearchTabs";
import SearchBox from "../SearchBox/SearchBox";

function SearchPanel() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("buy");
    const [query, setQuery] = useState("");
    const handleSearch = () => {
        const trimmedQuery = query.trim();

        if (activeTab === "buy") {
            navigate(
                trimmedQuery
                    ? `/buy?search=${encodeURIComponent(trimmedQuery)}`
                    : "/buy"
            );
        }
    };

    return (
        <div className="search-panel">
            <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <SearchBox
                activeTab={activeTab}
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
            />
        </div>
    );
}

export default SearchPanel;
