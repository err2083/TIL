import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import SideBar from "./SideBar";
import ContentContext from '../contexts/contents';

const ContentDetail = ( { match } ) => {
    const { postId } = match.params;
    const [content, setContent] = useState('');
    useEffect(() => {
        if (ContentContext.contents == null) return;
        setContent(ContentContext.contents[postId]);
    }, []);
    return (
        <section className="ftco-section ftco-no-pt ftco-no-pb">
            <div className="container">
                <div className="row d-flex">
                    <div className="col-xl-8 py-5 px-md-5">
                        <div className="row pt-md-4">
                            <ReactMarkdown source={content} />
                        </div>
                    </div>
                    <SideBar/>
                </div>
            </div>
        </section>
    );
};

export default React.memo(ContentDetail);