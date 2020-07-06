import React, { useState ,useEffect } from 'react';
import '../styles/style.scss';
import background from '../styles/images/redvelvet_seulgiimg300.jpg';

const Home = () => {
    const [backgroundImg, setBackgroundImg] = useState();
    useEffect(() => {
        const targetImg = document.getElementById('backgroundImg');
        targetImg.height = window.innerHeight;
        setBackgroundImg(targetImg);
    });

    return (
        <section className="ftco-about img ftco-section ftco-no-pt ftco-no-pb" id="about-section">
            <div className="container-fluid px-0">
                <div className="row d-flex">
                    <div className="col-md-6 d-flex">
                        <div className="img d-flex align-self-stretch align-items-center">
                            <img src={background} id="backgroundImg"/>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                        <div className="text px-4 pt-5 pt-md-0 px-md-4 pr-md-5">
                            <h2 className="mb-4"> Clean Bandit <span> Rockabye </span> (feat. Sean Paul & Anne-Marie)</h2>
                            <p>
                                Call it love and devotion
                                Call it a mom's adoration, foundation
                                A special bond of creation, hah
                                For all the single moms out there
                                Going through frustration
                                Clean Bandit, Sean-da-Paul, Anne-Marie
                                Sing, make them hear
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(Home);