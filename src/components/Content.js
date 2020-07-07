import React from 'react';

const Content = ( {imgNum} ) => {
    const imgUrl = require('../styles/images/redvelvet_seulgiimg' + imgNum + '.jpg');
    return (
        <div className="col-md-12">
            <div className="blog-entry d-md-flex">
                <a href="single.html" className="img img-2" style={{backgroundImage:`url(${imgUrl})`}} />
                <div className="text text-2 pl-md-4">
                    <h3 className="mb-2"><a href="single.html">도저히 버리지 못한 너의 향기</a></h3>
                    <div className="meta-wrap">
                        <p className="meta">
                            <span><i className="icon-calendar mr-2"></i>June 28, 2019</span>
                            <span><a href="single.html"><i className="icon-folder-o mr-2"></i>강슬기</a></span>
                            <span><i className="icon-comment2 mr-2"></i>5 Comment</span>
                        </p>
                    </div>
                    <p className="mb-4">내곁에 남아줄래 널 붙잡던 노래</p>
                    <p><a href="#" className="btn-custom">Read More <span className="ion-ios-arrow-forward"></span></a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Content;