import React, { useState, useEffect } from 'react';
import SideBar from "./SideBar";
import Content from "./Content";
import NavigateBar from "./NavigateBar";
import ContentContext from '../contexts/contents';

const contentList = ['javascript/Advanced_function.md', 'javascript/Behavior_delegation.md',
    'javascript/Closure.md', 'javascript/function.md', 'javascript/Object.md',
    'javascript/Prototype.md', 'javascript/Prototype_.md',
    'Java/behavior_parameterization.md', 'Java/lambda_expression.md', 'Java/stream_concept.md',];

const ContentList = () => {
    const [contents, setContents] = useState([]);

    useEffect(() => {
        const promises = contentList.map(url => {
            const mdFileUrl = require('../documents/' + url);
            return fetch(mdFileUrl).then((response) => response.text());
        });

        Promise.all(promises).then(texts => {
            setContents(texts);
            ContentContext.contents = texts;
        })
    }, []);
    return (
        <section className="ftco-section ftco-no-pt ftco-no-pb">
            <div className="container">
                <div className="row d-flex">
                    <div className="col-xl-8 py-5 px-md-5">
                        <div className="row pt-md-4">
                            {contents.length && contents.map((content, index) => {
                                return (<Content imgNum={index + 2} content={content} key={index} index={index}/>)
                            })}
                        </div>
                        <NavigateBar/>
                    </div>
                    <SideBar/>
                </div>
            </div>
        </section>
    );
};

export default ContentList;