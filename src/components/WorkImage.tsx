import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = ({ image, alt, video, link }: Props) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={link || "#work"}
        target={link ? "_blank" : undefined}
        rel={link ? "noopener noreferrer" : undefined}
        data-cursor="disable"
        onMouseEnter={() => video && setShowVideo(true)}
        onMouseLeave={() => setShowVideo(false)}
        onFocus={() => video && setShowVideo(true)}
        onBlur={() => setShowVideo(false)}
      >
        {link && (
          <div className="work-link" aria-hidden="true">
            <MdArrowOutward />
          </div>
        )}
        <img src={image} alt={alt || "Projektvorschau"} loading="lazy" />
        {showVideo && video && (
          <video src={video} autoPlay muted playsInline loop preload="metadata" />
        )}
      </a>
    </div>
  );
};

export default WorkImage;
