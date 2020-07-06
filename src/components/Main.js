import React from 'react';
import Home from "./Home";
import Route from "react-router-dom/es/Route";
import ContentList from "./ContentList";
// import ReactMarkdown from 'react-markdown';

const Main = () => {
    return (
        <div id="colorlib-main">
            <Route path="/" component={Home} exact={true} />
            <Route path="/content/list" component={ContentList} exact={true} />
        </div>
    );
};

export default Main;