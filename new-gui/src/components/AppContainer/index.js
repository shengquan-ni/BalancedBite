import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import UserSignupPanel from "../UserSignupPanel";
import ClickSuggestionPanel from "../ClickSuggestionPanel";
import UserInformationPanel from "../UserInformationPanel";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        userSignupPanel: UserSignupPanel,
        clickSuggestionPanel: ClickSuggestionPanel,
        userInformationPanel: UserInformationPanel
    },{
        initialRouteName: 'clickSuggestionPanel'
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;