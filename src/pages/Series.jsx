
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  getAllSeries,
  getChaptersBySeries,
} from "../services/contentService";
import "../styles/Series.css";

function Series() {
  const [series, setSeries] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSeriesAndChapters = async () => {
      try {
        const seriesResponse = await getAllSeries();

        const publishedSeries = seriesResponse.data.filter(
          (item) => item.status === "PUBLISHED"
        );

        const selectedSeries =
          publishedSeries.find((item) =>
            item.title.toUpperCase().includes("GENTLE ARMOR")
          ) || publishedSeries[0];

        if (!selectedSeries) {
          setSeries(null);
          return;
        }

        setSeries(selectedSeries);

        const chapterResponse = await getChaptersBySeries(
          selectedSeries.id
        );

        const publishedChapters = chapterResponse.data
          .filter((chapter) => chapter.status === "PUBLISHED")
          .sort(
            (a, b) => a.chapterNumber - b.chapterNumber
          );

        setChapters(publishedChapters);
      } catch (err) {
        console.error("Error fetching series:", err);
        setError("Unable to load this collection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesAndChapters();
  }, []);

  if (loading) {
    return (
      <main className="series-page">
        <p className="series-message">Loading collection...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="series-page">
        <p className="series-message">{error}</p>
      </main>
    );
  }

  if (!series) {
    return (
      <main className="series-page">
        <p className="series-message">
          No published series available yet.
        </p>
      </main>
    );
  }

  return (
    <main className="series-page">
      <section className="series-hero">
        <div className="series-hero-content">
          <p className="series-number">SERIES 01 — THE ARCHIVE</p>

          <h1>{series.title}</h1>

          <h3>Strength does not always need to be loud.</h3>

          <p className="series-intro">
            {series.description}
          </p>

          <a href="#chapters" className="series-explore-link">
            EXPLORE THE CHAPTERS
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      <section className="chapter-section" id="chapters">
        <div className="chapter-heading">
          <p className="section-label">FIVE EXPRESSIONS</p>
          <h2>THE CHAPTERS</h2>
          <p>
            Every chapter is a different expression of strength.
            Discover the stories behind the collection.
          </p>
        </div>

        {chapters.length === 0 ? (
          <p className="series-message">
            No published chapters available yet.
          </p>
        ) : (
          <div className="chapter-grid">
            {chapters.map((chapter, index) => (
              <Link
                to={`/archive/series-01/chapter/${chapter.id}`}
                className="chapter-card"
                key={chapter.id}
              >
                <span className="chapter-number">
                  CHAPTER{" "}
                  {String(
                    chapter.chapterNumber || index + 1
                  ).padStart(2, "0")}
                </span>

                <h3>{chapter.title}</h3>

                <p className="chapter-description">
                  {chapter.content
                    ? chapter.content.replace(/<[^>]*>/g, "").slice(0, 120)
                    : "Discover the story behind this chapter."}
                </p>

                <span className="chapter-link">
                  READ CHAPTER
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Series;
