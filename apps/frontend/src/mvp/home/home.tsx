import React from 'react';
import Header from '../Header';
import { Route, Routes } from 'react-router-dom';
import ProfilePage from '../profile/UserProfile';
import HeaderWithTabs from '../profile/HeaderWithTabs';

const Home: React.FC = () => {
    return (
        <div>
            <Header />
            s
            <Routes>
                <Route path="/profile" element={<HeaderWithTabs />}></Route>
            </Routes>
        </div>
    );
};

export default Home;