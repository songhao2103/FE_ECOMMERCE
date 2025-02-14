import { useEffect } from "react";

const NewArrival = () => {
  useEffect(() => {
    const elementList = document.querySelector(".list-products-featured");

    //IntersectionObserver là API dùng để theo dõi phần tử DOM, cho biết khi nào các phần tử đã được xuất hiện ở viewport
    //entries là mảng chứa các phần tử DOM
    //    1 entries cos các thuộc tính
    //        + entries.target: Phần tử đa được theo dõi
    //        + entries.isIntersecting: giá trị true nếu phần tử đã nằm trong viewport
    //        + entries.intersectionRatio: Phần trăm của phần tử đã hiển thị trong viewport
    //observer trong đối số của callback function chính là đối tượng intersectionObserver đang được sử dụng
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); //ngững theo dõi nếu phần tử đã hiển thị
        }
      },
      { threshold: 0.5 } //threshold dùng để xác định khi nào thì phần tử thực sự được coi là xuất hiện trong viewport,
      //  0.1 tức là khi kích thước của phần tử xuất hiện trong viewport 10% thì mới thực hiện hàm callback
    );

    observer.observe(elementList);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="new_arrival">
      <div className="header_section">
        <div className="title_section">
          <p className="desc">Fautured</p>
          <p className="title_36">New Arrival</p>
        </div>
      </div>

      <div className="list-products-featured">
        <div className="animate-element item1">
          <img
            src="https://songhao2103.github.io/IMG_du_an_REACT/ecommerce/products/anh_png_1-removebg-preview.png"
            alt=""
          />
          <div className="content">
            <p className="title-24">iPhone 16 Pro Max 256GB</p>
            <p className="desc">Lorem ipsum dolor, sit amet consectetur</p>
            <div className="bottom">
              <p className="desc">Shop Now</p>
              <div className="icon">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="animate-element item2">
          <img
            src="https://songhao2103.github.io/IMG_du_an_REACT/ecommerce/products/anh_png_2-removebg-preview.png"
            alt=""
          />
          <div className="content">
            <p className="title-24">MacBook Air M3 13 inch 2024</p>
            <p className="desc">Lorem ipsum dolor, sit amet consectetur</p>
            <div className="bottom">
              <p className="desc">Shop Now</p>
              <div className="icon">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="animate-element item3">
          <img
            src="https://songhao2103.github.io/IMG_du_an_REACT/ecommerce/products/anh_png_3-removebg-preview.png"
            alt=""
          />
          <div className="content">
            <p className="title-24">Apple AirPods</p>
            <p className="desc">Lorem ipsum dolor, sit amet consectetur</p>
            <div className="bottom">
              <p className="desc">Shop Now</p>
              <div className="icon">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="animate-element item4">
          <img
            src="https://songhao2103.github.io/IMG_du_an_REACT/ecommerce/products/anh_png_4-removebg-preview.png"
            alt=""
          />
          <div className="content">
            <p className="title-24">Apple AirPods</p>
            <p className="desc">Lorem ipsum dolor, sit amet consectetur</p>
            <div className="bottom">
              <p className="desc">Shop Now</p>
              <div className="icon">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
