import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  link?: string;
}

const WorkImage = ({ image, alt, link }: Props) => (
  <div className="work-image">
    <a className="work-image-in" href={link || "#work"} target={link ? "_blank" : undefined} rel="noopener noreferrer" data-cursor="disable">
      {link && <div className="work-link"><MdArrowOutward /></div>}
      <img src={image} alt={alt} />
    </a>
  </div>
);

export default WorkImage;
