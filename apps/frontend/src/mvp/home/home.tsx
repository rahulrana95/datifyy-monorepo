import React from 'react';
import Header from '../Header';
import { Outlet, Route, Routes } from 'react-router-dom';
import HeaderWithTabs from '../profile/HeaderWithTabs';
import HomeContentArea from './HomeContentArea';
import LandingPage from './LandingPage';
import AboutUs from '../AboutUs';
import TermsAndConditions from '../TNC';

const Home: React.FC = () => {
    return (
        <div className='home'>
            <Header />
            <HomeContentArea>
                {/* <Routes> */}

                <Outlet />
                {/* </Routes> */}
            </HomeContentArea>
        </div>
    );
};

export default Home;