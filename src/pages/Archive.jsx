// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getAllSeries } from "../services/contentService";
// import "../styles/Archive.css";

// function Archive() {
//   const [series, setSeries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchSeries = async () => {
//       try {
//         const response = await getAllSeries();

//         const publishedSeries = response.data.filter(
//           (item) => item.status === "PUBLISHED"
//         );

//         setSeries(publishedSeries);
//       } catch (err) {
//         console.error("Error fetching series:", err);
//         setError("Unable to load the archive. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSeries();
//   }, []);

//   return (
//     <main className="archive-page">
//       <section className="archive-heading">
//         <p className="section-label">A COLLECTION OF STORIES</p>

//         <h1>THE ARCHIVE</h1>

//         <p>
//           Every collection holds a story.
//           Explore the ideas, emotions and expressions
//           behind Quiet Battles.
//         </p>
//       </section>

//       <section className="archive-series">
//         {loading ? (
//           <p className="archive-message">Loading collections...</p>
//         ) : error ? (
//           <p className="archive-message">{error}</p>
//         ) : series.length === 0 ? (
//           <p className="archive-message">
//             No published collections are available yet.
//           </p>
//         ) : (
//           series.map((item, index) => (
//             <div className="archive-image" key={item.id}>
//               <img
//                 src={
//                   item.coverImageUrl ||
//                   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1400"
//                 }
//                 alt={`Editorial fashion portrait for ${item.title}`}
//               />

//               <div className="archive-overlay">
//                 <p>
//                   SERIES {String(index + 1).padStart(2, "0")}
//                 </p>

//                 <h2>{item.title}</h2>

//                 <p>{item.description}</p>

//                 <Link to="/archive/series-01">
//                   EXPLORE SERIES ↗
//                 </Link>
//               </div>
//             </div>
//           ))
//         )}
//       </section>
//     </main>
//   );
// }

// export default Archive;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getAllSeries } from "../services/contentService";
import "../styles/Archive.css";

function Archive() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await getAllSeries();

        const publishedSeries = response.data.filter(
          (item) => item.status === "PUBLISHED"
        );

        setSeries(publishedSeries);
      } catch (err) {
        console.error("Error fetching series:", err);
        setError("Unable to load the archive. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  return (
    <main className="archive-page">
      <section className="archive-heading">
        <p className="section-label">A COLLECTION OF STORIES</p>

        <h1>THE ARCHIVE</h1>

        <p className="archive-intro">
          Every collection holds a story.
          Explore the ideas, emotions and expressions
          behind Quiet Battles.
        </p>
      </section>

      <section className="archive-series">
        {loading ? (
          <p className="archive-message">Loading collections...</p>
        ) : error ? (
          <p className="archive-message">{error}</p>
        ) : series.length === 0 ? (
          <p className="archive-message">
            No published collections are available yet.
          </p>
        ) : (
          series.map((item, index) => (
            <article className="archive-image" key={item.id}>
              <img
                src={
                  item.coverImageUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1400"
                }
                alt={`Editorial fashion portrait for ${item.title}`}
                loading="lazy"
              />

              <div className="archive-overlay">
                <div className="archive-content">
                  <p className="archive-number">
                    SERIES {String(index + 1).padStart(2, "0")}
                  </p>

                  <h2>{item.title}</h2>

                  <p className="archive-description">
                    {item.description}
                  </p>

                  <Link
                    to="/archive/series-01"
                    className="archive-link"
                  >
                    EXPLORE SERIES
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default Archive;
