import React from 'react';
import Home from "./Home";
import { Route } from 'react-router-dom';
import ContentList from "./ContentList";
import ContentDetail from "./ContentDetail";

const Main = () => {
    return (
        <div id="colorlib-main">
            <Route path="/TIL" component={Home} exact={true} />
            <Route path="/TIL/content/list" component={ContentList} exact={true} />
            <Route path="/TIL/content/detail/:postId" component={ContentDetail} exact={true}/>
        </div>
    );
};

export default React.memo(Main);