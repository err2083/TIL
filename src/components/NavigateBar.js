import React from 'react';

const NavigateBar = () => {
    return (
        <div className="row">
            <div className="col">
                <div className="block-27">
                    <ul>
                        <li><a href="#">&lt;</a></li>
                        <li className="active"><span>1</span></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">5</a></li>
                        <li><a href="#">&gt;</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default React.memo(NavigateBar);