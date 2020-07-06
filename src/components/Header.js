import React from 'react';
import { Route, Link } from 'react-router-dom';

//TODO MOVE CONSTANTS
const NAV_ACTIVE = 'colorlib-active';

const Header = () => {
    const nowYear = new Date().getFullYear();
    function tt(e) {
        const exActive = document.getElementsByClassName('colorlib-active')[0];
        exActive.classList.remove(NAV_ACTIVE);
        e.target.parentNode.classList.add(NAV_ACTIVE);
    }
    return (
        <aside id="colorlib-aside" role="complementary" className="js-fullheight">
            <nav id="colorlib-main-menu" role="navigation">
                <ul>
                    <li className="colorlib-active">
                        <Link to="/" onClick={tt}>Home</Link>
                    </li>
                    <li>
                        <Link to="/content/list" onClick={tt}>List</Link>
                    </li>
                </ul>
            </nav>
            <div className="colorlib-footer">
                {/*//Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0.*/}
                <p className="pfooter">
                    Copyright &copy;{nowYear} All rights reserved | This template is made with
                    <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
                    {/*//Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0.*/}
                </p>
            </div>
        </aside>
    );
};

export default React.memo(Header);