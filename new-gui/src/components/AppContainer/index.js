import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import UserSignupPanel from "../UserSignupPanel";
import MainTab from "../MainTab";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        userSignupPanel: UserSignupPanel,
        mainTab: MainTab
    },{
        initialRouteName: 'mainTab'
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;