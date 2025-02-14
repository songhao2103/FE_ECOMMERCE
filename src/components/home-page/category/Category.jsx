const Category = () => {
  return (
    <div className="category_home_page">
      <div className="header_section">
        <div className="title_section">
          <p className="desc">Categories</p>
          <p className="title_36">Browse by Categoty</p>
        </div>
      </div>

      <div className="list_categories">
        <div className="category">
          <div className="icon">
            <i className="fa-solid fa-mobile-screen"></i>
          </div>
          <div className="desc">Phones</div>
        </div>
        <div className="category">
          <div className="icon">
            <i className="fa-solid fa-desktop"></i>
          </div>
          <div className="desc">Computers</div>
        </div>
        <div className="category">
          <div className="icon">
            <i className="fa-regular fa-clock"></i>
          </div>
          <div className="desc">Smartwatch</div>
        </div>
        <div className="category">
          <div className="icon">
            <i className="fa-solid fa-camera-retro"></i>
          </div>
          <div className="desc">Camera</div>
        </div>
        <div className="category">
          <div className="icon">
            <i className="fa-solid fa-headphones-simple"></i>
          </div>
          <div className="desc">Headphones</div>
        </div>
        <div className="category">
          <div className="icon">
            <i className="fa-solid fa-gamepad"></i>
          </div>
          <div className="desc">Gaming</div>
        </div>
      </div>
    </div>
  );
};

export default Category;
