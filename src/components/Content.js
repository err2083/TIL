import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const Content = ( {imgNum, content, index} ) => {
    const imgUrl = require('../styles/images/redvelvet_seulgiimg' + imgNum + '.jpg');
    const [summaryContent, setSummaryContent] = useState({});
    useEffect(() => {
        if (content == null) return;
        const arrayContent = content.split('#').filter(item => item);
        setSummaryContent({
            title: arrayContent[1].split('1. ')[1],
            summary: arrayContent[2].split('개요')[1]
        });
    }, [content]);
    return (
        <div className="col-md-12">
            <div className="blog-entry d-md-flex">
                <a href="single.html" className="img img-2" style={{backgroundImage:`url(${imgUrl})`}} />
                <div className="text text-2 pl-md-4">
                    <h3 className="mb-2"><a href="single.html">{summaryContent.title}</a></h3>
                    <div className="meta-wrap">
                        <p className="meta">
                            <span><i className="icon-calendar mr-2"></i>June 00, 0000</span>
                            <span><a href="single.html"><i className="icon-folder-o mr-2"></i>강슬기</a></span>
                            <span><i className="icon-comment2 mr-2"></i>0 Comment</span>
                        </p>
                    </div>
                    <p className="mb-4">{summaryContent.summary}</p>
                    <p><Link to={`/TIL/content/detail/${index}`}> Read More </Link><span className="ion-ios-arrow-forward"></span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Content);