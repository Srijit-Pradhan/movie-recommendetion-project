// Step 1: Necessary library gulo
import React from "react";
import Modal from "react-modal"; // Popup er jonno use korchi
import YouTube from "react-youtube"; // Youtube video play korar package
import { X } from "lucide-react"; // Cross (close) icon nilam
import "./TrailerModal.css";

// Accessibility ba screen reader jeno baki app take chine (hide) nite pare modal kholar somoy
Modal.setAppElement("#root");

const TrailerModal = ({ isOpen, onRequestClose, trailerLink }) => {
  // Step 2: YouTube link (URL) theke ashol Video ID bar korar ekta syntax o function.
  // Karon YouTube player package ta shudhu id dorkar hoy, pura link noy.
  // Jemon: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -> "dQw4w9WgXcQ"
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/; // Regex pattern for youtube link
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(trailerLink);

  return (
    <Modal
      isOpen={isOpen} // true/false jeta page theke ashbe (khulo/bondho thako)
      onRequestClose={onRequestClose} // click outside korle/close er jonno func
      className="trailer-modal" // custom css styling er jonno default theke bypass korchi
      overlayClassName="trailer-overlay" // pichoner backgound shadow
      contentLabel="Movie Trailer"
    >
      <button onClick={onRequestClose} className="close-modal-btn">
        <X size={24} />
      </button>

      {/* Step 3: Jodi ID thake tahole native iframe render korbo jate cross-origin warning na ashe, noile error message */}
      <div className="video-container">
        {videoId ? (
          <iframe
            className="youtube-player"
            style={{ width: "100%", height: "100%", border: "none" }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${window.location.origin}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Movie Trailer"
          />
        ) : (
          <div className="no-trailer">
            <h3>Trailer (Video) for this movie is currently unavailable.</h3>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TrailerModal;
