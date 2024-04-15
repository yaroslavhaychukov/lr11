import React from 'react';
import '../../styles/Footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';

const Footer = () => {
  return (
    <>
      <div className="footer-columns">
        <div className="footer-column">
          <h3>Ссылки</h3>
          <ul>
            <li><a href="#">О нас</a></li>
            <li><a href="#">Контакты</a></li>
            <li><a href="#">Поддержка</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Приложение</h3>
          <ul>
            <li><a href="#">Скачать для iOS</a></li>
            <li><a href="#">Скачать для Android</a></li>
          </ul>
        </div>
      </div>
      <div className="footerbottom">
          <p>2024 ТехноМехПлюс. &#169;</p>
        <div className='RightText'>
            <PinterestIcon />
            <TwitterIcon />
            <InstagramIcon />
            <FacebookIcon />
            </div>
      </div>
    </>
  );
};

export default Footer;
