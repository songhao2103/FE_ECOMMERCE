const FooterComponent = () => {
  return (
    <div className="footer">
      <div className="bgc-footer"></div>
      <div className="content">
        <div className="item">
          <p className="title-24">Exclusive</p>
          <p className="title-20">Subscribe</p>
          <p className="desc">Get 10% off your first order</p>
          <div className="search">
            <input type="text" placeholder="Enter your email" />
            <div className="icon">
              <i className="fa-regular fa-paper-plane"></i>
            </div>
          </div>
        </div>

        <div className="item">
          <p className="title-20">Support</p>
          <p className="desc">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p className="desc">exclusive@gmail.com</p>
          <p className="desc">+88015-88888-9999</p>
        </div>

        <div className="item">
          <p className="title-20">Quick Link</p>
          <p className="desc">Privacy Policy</p>
          <p className="desc">Terms Of Use</p>
          <p className="desc">FAQ</p>
          <p className="desc">Contact</p>
        </div>

        <div className="item">
          <p className="title-20">Download App</p>
          <p className="desc">Save $3 with App New User Only</p>

          <div className="box-app">
            <div className="app">
              <div className="icon">
                <i className="fa-brands fa-google-play"></i>
              </div>
              <p className="desc">Google Play</p>
            </div>
            <div className="app">
              <div className="icon">
                <i className="fa-brands fa-apple"></i>
              </div>
              <p className="desc">App Store</p>
            </div>
          </div>

          <div className="box-network">
            <div className="network">
              <i className="fa-brands fa-facebook-f"></i>
            </div>
            <div className="network">
              <i className="fa-brands fa-twitter"></i>
            </div>
            <div className="network">
              <i className="fa-brands fa-instagram"></i>
            </div>
            <div className="network">
              <i className="fa-brands fa-linkedin-in"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
