import React, { useState, useEffect } from 'react';
import SideBar from "./SideBar";
import Content from "./Content";
import NavigateBar from "./NavigateBar";
import ReactMarkdown from 'react-markdown';
import mdFilePath from '../documents/javascript/Object.md';

const ContentList = () => {
    // const [contents, setContents] = useState(undefined);
    //
    // useEffect(() => {
    //     fetch(mdFilePath).then((response) => response.text()).then((text) => {
    //         setContents(text);
    //     });
    // });
    return (
        <section className="ftco-section ftco-no-pt ftco-no-pb">
            <div className="container">
                <div className="row d-flex">
                    <div className="col-xl-8 py-5 px-md-5">
                        <div className="row pt-md-4">
                            <Content imgNum={586}/>
                            <Content imgNum={2}/>
                            <Content imgNum={4}/>
                            <Content imgNum={5}/>
                            <Content imgNum={7}/>
                            <Content imgNum={124}/>
                            <Content imgNum={128}/>
                            <Content imgNum={643}/>
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