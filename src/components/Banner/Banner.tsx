import './Banner.css';
import Grassland from '../../assets/images/grassland.png';
import BannerIcon from '../../assets/images/banner_icon.svg';

interface BannerProps {
  title: string;
  description: string;
}

const Banner: React.FC<BannerProps> = ({ title, description }) => {
  return (
    <div className="banner">
        <div className="banner__content">
            <img src={BannerIcon} alt="Grassland nature" />
            <div className="banner_contents--bottom">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
        <img src={Grassland} alt="Grassland nature" className="banner__image" />
        <div className="banner__overlay"></div>
    </div>
  );
};

export default Banner;
