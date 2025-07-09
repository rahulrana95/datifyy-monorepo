import React from 'react';
import Header from '../Header';
import { Outlet } from 'react-router-dom';
import HomeContentArea from './HomeContentArea';

const Home: React.FC = () => {
    return (
        <div className='home'>
            <Header />
            <HomeContentArea>
                <Outlet />
            </HomeContentArea>
        </div>
    );
};

export default Home;
