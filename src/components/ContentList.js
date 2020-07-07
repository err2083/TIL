import React from 'react';
import SideBar from "./SideBar";
import Content from "./Content";
import NavigateBar from "./NavigateBar";

const ContentList = () => {
    return (
        <section className="ftco-section ftco-no-pt ftco-no-pb">
            <div className="container">
                <div className="row d-flex">
                    <div className="col-xl-8 py-5 px-md-5">
                        <div className="row pt-md-4">
                            <Content imgNum={651}/>
                            <Content imgNum={125}/>
                            <Content imgNum={151}/>
                        </div>
                    </div>
                </div>
            </div>
            <NavigateBar/>
            <SideBar/>
        </section>
    );
};

export default ContentList;