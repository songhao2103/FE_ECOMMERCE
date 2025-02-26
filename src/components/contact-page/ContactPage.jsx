const ContactPage = () => {
  return (
    <div className="contact_page">
      <div className="top_page">
        <div className="title_36">Contact</div>
      </div>

      <div className="content_page">
        <div className="box_left">
          <div className="item">
            <div className="top">
              <div className="icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <p className="title_20">Call To Us</p>
            </div>
            <div className="box_desc">
              <div className="p desc">
                We are available 24/7, 7 days a week.
              </div>
              <div className="p desc">Phone: +8801611112222</div>
            </div>
          </div>
          <div className="item">
            <div className="top">
              <div className="icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <p className="title_20">Write To US</p>
            </div>

            <div className="box_desc">
              <p className="desc">
                Fill out our form and we will contact you within 24 hours.
              </p>
              <p className="desc">Emails: customer@exclusive.com</p>
              <p className="desc">Emails: support@exclusive.com</p>
            </div>
          </div>
        </div>

        <div className="box_right">
          <div className="box_input">
            <input type="text" name="" id="" placeholder="Your name" />
            <input type="text" name="" id="" placeholder="Your email" />
            <input type="text" name="" id="" placeholder="Your phone" />
          </div>

          <textarea
            className="desc"
            name=""
            id=""
            placeholder="Your message"
          ></textarea>

          <div className="bottom">
            <div className="btn_dark_pink">Send message</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
