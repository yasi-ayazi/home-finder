import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProperty } from "../api/properties";
import type { Property } from "../types/property";
import "./PropertyDetails.css";


function PropertyDetails() {
    const { id } = useParams();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [showThumbnails, setShowThumbnails] = useState(true);

    useEffect(() => {
        async function loadProperty() {
            if (!id) { return; }
            try {
                const data = await fetchProperty(id);
                setProperty(data);
                setError("");
            }
            catch {
                setError("Failed to load property");
            }
            finally {
                setLoading(false);
            }
        }
        loadProperty();
    }, [id]);

    useEffect(() => {
        document.body.style.overflow = isGalleryOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isGalleryOpen]);

    function showPreviousImage() {
        if (!property) return;

        setSelectedImageIndex((currentIndex) =>
            currentIndex === 0
                ? property.imageUrls.length - 1
                : currentIndex - 1
        );
    }

    function showNextImage() {
        if (!property) return;

        setSelectedImageIndex((currentIndex) =>
            currentIndex === property.imageUrls.length - 1
                ? 0
                : currentIndex + 1
        );
    }

    return (
        <main>
            {loading && <p>Loading...</p>}

            {error && <p>{error}</p>}

            {property && (
                <>
                    <div className="property-details__gallery">
                        <img
                            src={property.imageUrls[0]}
                            alt={property.address}
                            className="property-details__gallery-main"
                            onClick={() => {
                                setSelectedImageIndex(0);
                                setIsGalleryOpen(true);
                            }}
                        />
                        <div className="property-details__gallery-thumbnails">
                            {property.imageUrls.slice(1).map((url, index) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt={property.address}
                                    className="property-details__gallery-thumbnail"
                                    onClick={() => {
                                        setSelectedImageIndex(index + 1);
                                        setIsGalleryOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {isGalleryOpen && (
                        <div className="property-details__lightbox">
                            <span className="property-details__lightbox-counter">
                                {selectedImageIndex + 1}/{property.imageUrls.length}
                            </span>
                            <button
                                className="property-details__lightbox-toggle"
                                onClick={() => setShowThumbnails((current) => !current)}
                            >
                                {showThumbnails ? "Hide all images" : "Show all images"}
                            </button>
                            {showThumbnails && (
                                <div className="property-details__lightbox-thumbnails">
                                    {property.imageUrls.map((url, index) => (
                                        <img
                                            key={url}
                                            src={url}
                                            alt={property.address}
                                            className={
                                                index === selectedImageIndex
                                                    ? "property-details__lightbox-thumbnail property-details__lightbox-thumbnail--active"
                                                    : "property-details__lightbox-thumbnail"
                                            }
                                            onClick={() => setSelectedImageIndex(index)}
                                        />
                                    ))}
                                </div>
                            )}
                            <button
                                className="property-details__lightbox-close"
                                onClick={() => setIsGalleryOpen(false)}
                                aria-label="Close gallery"
                            >
                                ×
                            </button>
                            <button
                                className="property-details__lightbox-arrow property-details__lightbox-arrow--left"
                                onClick={showPreviousImage}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <img
                                src={property.imageUrls[selectedImageIndex]}
                                alt={property.address}
                                className="property-details__lightbox-image"
                            />
                            <button
                                className="property-details__lightbox-arrow property-details__lightbox-arrow--right"
                                onClick={showNextImage}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
export default PropertyDetails;