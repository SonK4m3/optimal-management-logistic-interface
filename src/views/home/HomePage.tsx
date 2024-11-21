import React from 'react'
import BaseLayout from '@/components/layout/BaseLayout'
import HomePageProvider from '@/contexts/HomePageContext'
import UserInfoWidget from './UserInfoWidget'
import UpdateInfoWidget from './UpdateInfoWidget'

const HomePage: React.FC = () => {
    return (
        <BaseLayout title='Home'>
            <HomePageProvider>
                <UserInfoWidget />
                <UpdateInfoWidget />
            </HomePageProvider>
        </BaseLayout>
    )
}

export default HomePage
