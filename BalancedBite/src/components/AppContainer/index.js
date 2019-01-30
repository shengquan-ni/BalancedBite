import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import UserInfoFillOut from "../UserInfoFillOut";
import ClickSuggestionPanel from "../ClickSuggestionPanel";
import UserSignupPanel from "../UserSignupPanel";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        userSignupPanel: UserInfoFillOut,
        clickSuggestionPanel: ClickSuggestionPanel
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;