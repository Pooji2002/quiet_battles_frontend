
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getChapterById } from "../services/contentService";
import { getProductById } from "../services/productService";
import "../styles/Chapter.css";

function Chapter() {
  const { chapterId } = useParams();

  const [chapter, setChapter] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        setError("");
        setChapter(null);
        setRelatedProduct(null);

        const response = await getChapterById(chapterId);
        const chapterData = response.data;

        setChapter(chapterData);

        if (chapterData.productId) {
          try {
            const productResponse = await getProductById(
              chapterData.productId
            );

            setRelatedProduct(productResponse.data);
          } catch (productError) {
            console.error(
              "Error fetching related product:",
              productError
            );
          }
        }
      } catch (err) {
        console.error("Error fetching chapter:", err);
        setError("Unable to load this chapter.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  if (loading) {
    return (
      <main className="chapter-page">
        <p className="chapter-message">Loading chapter...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="chapter-page">
        <p className="chapter-message">{error}</p>
      </main>
    );
  }

  if (!chapter) {
    return (
      <main className="chapter-page">
        <p className="chapter-message">Chapter not found.</p>
      </main>
    );
  }

  const chapterNumber = String(
    chapter.chapterNumber || 1
  ).padStart(2, "0");

  return (
    <main className="chapter-page">

      {/* Chapter hero */}

      <section className="chapter-hero">
        <div className="chapter-hero-inner">
          <p className="chapter-breadcrumb">
            THE ARCHIVE / SERIES 01 / CHAPTER {chapterNumber}
          </p>

          <h1>{chapter.title}</h1>

          <span className="chapter-hero-line"></span>
        </div>
      </section>

      {/* Chapter image and story */}

      <section className="chapter-editorial">

        <div className="chapter-image">
          <img
            src={
              chapter.imageUrl ||
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200"
            }
            alt={chapter.title}
          />

          <p>THE GENTLE ARMOR — AN EXPRESSION OF STRENGTH</p>
        </div>

        <div className="chapter-story-section">
          <p className="chapter-eyebrow">
            CHAPTER {chapterNumber}
          </p>

          <h2>EVERY BATTLE HAS A STORY.</h2>

          <div className="chapter-story">
            {chapter.content}
          </div>
        </div>

      </section>

      {/* Related product */}

      <section className="chapter-product-section">
        <p className="chapter-eyebrow">CARRY YOUR STORY</p>

        <h2>STRENGTH, IN EVERY THREAD.</h2>

        {relatedProduct ? (
          <div className="chapter-related-product">
            {relatedProduct.imageUrl && (
              <img
                src={relatedProduct.imageUrl}
                alt={relatedProduct.name}
                className="chapter-related-image"
                loading="lazy"
              />
            )}

            <div className="chapter-related-details">
              <h3>{relatedProduct.name}</h3>

              <p>{relatedProduct.description}</p>

              <p className="chapter-related-price">
                ₹{Number(relatedProduct.price).toLocaleString("en-IN")}
              </p>

              <Link
                to={`/product/${relatedProduct.id}`}
                className="chapter-product-link"
              >
                DISCOVER THE RELATED PRODUCT
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        ) : (
          <p className="chapter-no-product">
            No product is currently associated with this chapter.
          </p>
        )}
      </section>

      {/* Back navigation */}

      <section className="chapter-navigation">
        <Link to="/archive/series-01">
          ← BACK TO THE CHAPTERS
        </Link>
      </section>

    </main>
  );
}

export default Chapter;
