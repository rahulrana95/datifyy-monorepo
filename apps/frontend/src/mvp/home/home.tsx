import React from 'react';
import Header from '../Header';
import { Route, Routes } from 'react-router-dom';
import HeaderWithTabs from '../profile/HeaderWithTabs';
import HomeContentArea from './HomeContentArea';

const Home: React.FC = () => {
    return (
        <div className='home'>
            <Header />
            <HomeContentArea footer={<div>Footer</div>}>
                <Routes>
                    <Route path="/profile" element={<HeaderWithTabs />}></Route>
                </Routes>
            </HomeContentArea>
        </div>
    );
};

export default Home;