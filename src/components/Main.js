import React from 'react';
import Home from "./Home";
import { Route } from 'react-router-dom';
import ContentList from "./ContentList";
// import ReactMarkdown from 'react-markdown';

const Main = () => {
    return (
        <div id="colorlib-main">
            <Route path="/TIL" component={Home} exact={true} />
            <Route path="/TIL/content/list" component={ContentList} exact={true} />
        </div>
    );
};

export default React.memo(Main);