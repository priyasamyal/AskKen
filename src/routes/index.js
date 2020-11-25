import React from 'react';

// import Home from '@components/Home';
// import DashBoard from '@components/DashBoard';
// import Calling from '@components/Calling';
//import CalKit from '@components/CalKit';
import SplashScreeen from '@components/SplashScreen';

import Introduction from '@components/Introduction';
import EnterPhoneNumber from '@components/EnterPhoneNumber';
import VerifyNumber from '@components/VerifyNumber';
import EnterName from '@components/EnterName';
import EnterPassword from '@components/EnterPassword';
import UploadImage from '@components/UploadImage';
import SelectUser from '@components/SelectUser';
import Notification from '@components/Notification';
import HomePage from '@components/HomePage';
import CreatePassword from '@components/CreatePassword';
import DisplayProfile from '@components/DisplayProfile';
import Categories from '@components/Categories';
import TicketMediaType from '@components/TicketMediaType';
import DisplayLicense from '@components/DisplayLicense';
import ForgotPassword from '@components/ForgotPassword';
import CallReady from '@components/CallReady';
import CommonPage from '@components/CommonPage';
import StripeConnect from '@components/StripeConnect';
import Rating from '@components/Rating';
import Tip from '@components/Tip';
import VideoCall from '@components/VideoCall';
import CardDetails from '@components/CardDetails';
import EditCategory from '@components/EditCategory';
import TicketDescription from '@components/TicketDescription';
import ExpertIntro from '@components/ExpertIntro';
import swipeFooter from '@components/swipeFooter';
import OwnerPayment from '@components/OwnerPayment';
import Preview from '@components/Preview';
import TicketChat from '@components/TicketChat';
import ChatList from '@components/ChatList';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const RootStack = createStackNavigator(
    {
        // Home: Home,
        // DashBoard: DashBoard,
        // Calling: Calling,
        // CalKit: CalKit,
        Introduction: Introduction,
        SplashScreeen: SplashScreeen,
        EnterPhoneNumber: EnterPhoneNumber,
        VerifyNumber: VerifyNumber,
        EnterName: EnterName,
        EnterPassword: EnterPassword,
        UploadImage: UploadImage,
        SelectUser: SelectUser,
        DisplayProfile: DisplayProfile,
        Notification: Notification,
        HomePage: HomePage,
        CreatePassword: CreatePassword,
        TicketMediaType: TicketMediaType,
        DisplayLicense: DisplayLicense,
        Categories: Categories,
        CallReady: CallReady,
        ForgotPassword: ForgotPassword,
        CommonPage: CommonPage,
        Rating: Rating,
        Tip: Tip,
        VideoCall: VideoCall,
        StripeConnect: StripeConnect,
        CardDetails: CardDetails,
        TicketDescription: TicketDescription,
        EditCategory: EditCategory,
        ExpertIntro: ExpertIntro,
        swipeFooter: swipeFooter,
        OwnerPayment: OwnerPayment,
        TicketChat: TicketChat,
        ChatList: ChatList,
        Preview: Preview
    },
    {
        initialRouteName: 'SplashScreeen',
        headerMode: 'none',
    },
);


const AppContainer = createAppContainer(RootStack);
export default AppContainer;
