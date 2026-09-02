import { useEffect, useRef } from "react";
import "./PropertyFilters.css";

type PropertyFiltersProps = {
    isOpen: boolean;
    onToggle: () => void;
    selectedTypes: string[];
    onTypesChange: (types: string[]) => void;
    minPrice: string;
    maxPrice: string;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
};

const MAX_PRICE = 5000000;

function PropertyFilters({
    isOpen,
    onToggle,
    selectedTypes,
    onTypesChange,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
}: PropertyFiltersProps) {
    const filtersRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                filtersRef.current &&
                !filtersRef.current.contains(event.target as Node)
            ) {
                onToggle();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onToggle]);

    function handleTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const type = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            onTypesChange([...selectedTypes, type]);
        } else {
            onTypesChange(
                selectedTypes.filter((selectedType) => selectedType !== type),
            );
        }
    }

    const minPriceValue = minPrice === "" ? 0 : Number(minPrice);

    const maxPriceValue = maxPrice === "" ? MAX_PRICE : Number(maxPrice);

    const hasPriceFilter = minPrice !== "" || maxPrice !== "";

    const activeFilterCount = selectedTypes.length + (hasPriceFilter ? 1 : 0);

    function handleMinPriceChange(value: string) {
        const newMinPrice = Number(value);

        if (newMinPrice <= maxPriceValue) {
            onMinPriceChange(value);
        }
    }
    function handleMaxPriceChange(value: string) {
        const newMaxPrice = Number(value);

        if (newMaxPrice >= minPriceValue) {
            onMaxPriceChange(value);
        }
    }

    return (
        <div className="property-filters-wrapper" ref={filtersRef}>
            <button
                type="button"
                className="property-filters"
                onClick={onToggle}
            >
                <span>Filters</span>

                {activeFilterCount > 0 && (
                    <span className="property-filters__count">
                        {activeFilterCount}
                    </span>
                )}

                <span className="property-filters__arrow">
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>

            {isOpen && (
                <div className="property-filters__panel">
                    <div className="property-filters__group">
                        <h3 className="property-filters__title">
                            Property Type
                        </h3>

                        <label>
                            <input
                                type="checkbox"
                                value="Villa"
                                checked={selectedTypes.includes("Villa")}
                                onChange={handleTypeChange}
                            />
                            Villa
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                value="Apartment"
                                checked={selectedTypes.includes("Apartment")}
                                onChange={handleTypeChange}
                            />
                            Apartment
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                value="Townhouse"
                                checked={selectedTypes.includes("Townhouse")}
                                onChange={handleTypeChange}
                            />
                            Townhouse
                        </label>
                    </div>

                    <div className="property-filters__group">
                        <h3 className="property-filters__title">Price Range</h3>

                        <div className="property-filters__price-range">
                            <div className="property-filters__price-track"></div>

                            <div
                                className="property-filters__price-selected"
                                style={{
                                    left: `${(minPriceValue / MAX_PRICE) * 100}%`,
                                    right: `${
                                        100 - (maxPriceValue / MAX_PRICE) * 100
                                    }%`,
                                }}
                            ></div>

                            <input
                                type="range"
                                min="0"
                                max={MAX_PRICE}
                                step="100000"
                                value={minPriceValue}
                                onChange={(e) =>
                                    handleMinPriceChange(e.target.value)
                                }
                            />

                            <input
                                type="range"
                                min="0"
                                max={MAX_PRICE}
                                step="100000"
                                value={maxPriceValue}
                                onChange={(e) =>
                                    handleMaxPriceChange(e.target.value)
                                }
                            />
                        </div>

                        <div className="property-filters__price-inputs">
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) =>
                                    handleMinPriceChange(e.target.value)
                                }
                            />

                            <input
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) =>
                                    handleMaxPriceChange(e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyFilters;
