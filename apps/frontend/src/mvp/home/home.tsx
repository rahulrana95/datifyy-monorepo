import React from 'react';
import Header from '../Header';
import { Route, Routes } from 'react-router-dom';
import HeaderWithTabs from '../profile/HeaderWithTabs';
import HomeContentArea from './HomeContentArea';
import LandingPage from './LandingPage';

const Home: React.FC = () => {
    return (
        <div className='home'>
            <Header />
            <HomeContentArea>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="/profile" element={<HeaderWithTabs />}></Route>
                </Routes>
            </HomeContentArea>
        </div>
    );
};

export default Home;