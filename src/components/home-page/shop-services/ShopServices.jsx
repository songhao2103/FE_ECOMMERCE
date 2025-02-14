const ShopServices = () => {
  return (
    <div className="shop-services">
      <div className="service">
        <div className="bgc-icon">
          <div className="icon">
            <i className="fa-solid fa-truck"></i>
          </div>
        </div>
        <div className="content">
          <div className="title-20">FREE AND FAST DELIVERY</div>
          <p className="desc">Free delivery for all orders over $140</p>
        </div>
      </div>
      <div className="service">
        <div className="bgc-icon">
          <div className="icon">
            <i className="fa-solid fa-phone"></i>
          </div>
        </div>
        <div className="content">
          <div className="title-20">24/7 CUSTOMER SERVICE</div>
          <p className="desc">Friendly 24/7 customer support</p>
        </div>
      </div>
      <div className="service">
        <div className="bgc-icon">
          <div className="icon">
            <i className="fa-solid fa-check"></i>
          </div>
        </div>
        <div className="content">
          <div className="title-20">MONEY BACK GUARANTEE</div>
          <p className="desc">We reurn money within 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default ShopServices;
