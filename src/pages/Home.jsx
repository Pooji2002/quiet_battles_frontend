
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">AN EXPRESSION OF RESILIENCE</p>

          <h1>
            WEAR YOUR
            <br />
            <span>BATTLES.</span>
          </h1>

          <p className="hero-description">
            Every scar has a story. Every layer holds a memory.
            Wear what made you.
          </p>

          <Link to="/archive" className="hero-button">
            EXPLORE THE ARCHIVE
          </Link>
        </div>

        <div className="hero-bottom">
          <span>QUIET BATTLES™</span>
          <span>EST. 2026</span>
        </div>
      </section>

      <section className="brand-intro" id="about">
        <p className="section-label">BEYOND THE SURFACE</p>
        <h2>
          Some battles are never seen.
          <br />
          <span>But they are always worn.</span>
        </h2>
        <p>
          Quiet Battles is an expression of individuality,
          resilience and the stories we carry within us.
        </p>
      </section>

      <section className="collections" id="collections">
        <p className="section-label">DISCOVER OUR WORLD</p>
        <h2>THE ARCHIVE</h2>

        <div className="collection-card">
          <div>
            <p>SERIES 01</p>
            <h3>THE GENTLE ARMOR™</h3>
            <p>Strength does not always need to be loud.</p>
            <Link to="/archive">DISCOVER THE SERIES ↗</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
