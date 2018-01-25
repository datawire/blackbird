import React from 'react';
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

const Carousel = ({children}) =>
    <div className="tutorials">
      <Slider {...settings}>
        {React.Children.map(children, (child, i) =>
          <div>
            <div className="tutorial">
              { child }
            </div>
          </div>
        )}
      </Slider>
    </div>;

export default Carousel;