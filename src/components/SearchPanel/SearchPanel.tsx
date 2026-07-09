import { useState } from "react";
import "./SearchPanel.css";
import SearchTabs from "../SearchTabs/SearchTabs";
import SearchBox from "../SearchBox/SearchBox";

function SearchPanel() {
    const [activeTab, setActiveTab] = useState("buy");
    return (
        <div className="search-panel">
            <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <SearchBox activeTab={activeTab} />

        </div>
    );
}

export default SearchPanel;