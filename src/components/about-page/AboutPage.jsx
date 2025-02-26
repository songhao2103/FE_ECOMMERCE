//import ảnh
import media from "/media_images/image_about_ecommerce.png";
import imageBoss_1 from "/media_images/image 46.png";
import imageBoss_2 from "/media_images/image 47.png";
import imageBoss_3 from "/media_images/image 51.png";

const AboutPage = () => {
  return (
    <div className="about_page">
      <div className="top_page">
        <p className="title_36">About</p>
      </div>
      <div className="content_page">
        <div className="box_introduce">
          <div className="box_left">
            <p className="title_36">Our Story</p>
            <div className="box_desc">
              <p className="desc">
                Launced in 2015, Exclusive is South Asia’s premier online
                shopping makterplace with an active presense in Bangladesh.
                Supported by wide range of tailored marketing, data and service
                solutions, Exclusive has 10,500 sallers and 300 brands and
                serves 3 millioons customers across the region.{" "}
              </p>
              <p className="desc">
                Exclusive has more than 1 Million products to offer, growing at
                a very fast. Exclusive offers a diverse assotment in categories
                ranging from consumer.
              </p>
            </div>
          </div>

          <div className="box_right">
            <img src={media} alt="" />
          </div>
        </div>
        <div className="box_options">
          <div className="option">
            <div className="box_icon">
              <div className="bgc_icon">
                <div className="icon">
                  <i className="fa-solid fa-house"></i>
                </div>
              </div>
            </div>
            <p className="title_24">10.5k</p>
            <p className="desc">Sallers active our site</p>
          </div>
          <div className="option">
            <div className="box_icon">
              <div className="bgc_icon">
                <div className="icon">
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
              </div>
            </div>
            <p className="title_24">33k</p>
            <p className="desc">Mopnthly Produduct Sale</p>
          </div>
          <div className="option">
            <div className="box_icon">
              <div className="bgc_icon">
                <div className="icon">
                  <i className="fa-solid fa-suitcase-rolling"></i>
                </div>
              </div>
            </div>
            <p className="title_24">45.5k</p>
            <p className="desc">Customer active in our site</p>
          </div>
          <div className="option">
            <div className="box_icon">
              <div className="bgc_icon">
                <div className="icon">
                  <i className="fa-solid fa-sack-dollar"></i>
                </div>
              </div>
            </div>
            <p className="title_24">25k</p>
            <p className="desc">Anual gross sale in our site</p>
          </div>
        </div>

        <div className="box_boss">
          <div className="item">
            <div className="box_image">
              <img src={imageBoss_1} alt="" />
            </div>
            <div className="info_boss">
              <p className="title_24">Tom Cruise</p>
              <p className="desc">Founder & Chairman</p>
              <div className="list_icon">
                <i className="fa-brands fa-x-twitter"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="box_image">
              <img src={imageBoss_3} alt="" />
            </div>
            <div className="info_boss">
              <p className="title_24">Emma Watson</p>
              <p className="desc">Managing Director</p>
              <div className="list_icon">
                <i className="fa-brands fa-x-twitter"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="box_image">
              <img src={imageBoss_2} alt="" />
            </div>
            <div className="info_boss">
              <p className="title_24">Will Smith</p>
              <p className="desc">Product Designer</p>
              <div className="list_icon">
                <i className="fa-brands fa-x-twitter"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
