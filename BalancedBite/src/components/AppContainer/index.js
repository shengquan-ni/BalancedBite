import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import UserSignupPanel from "../UserSignupPanel";
import UserInfoFillOut from "../UserInfoFillOut";
import ClickSuggestionPanel from "../ClickSuggestionPanel";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        signupPanel: UserSignupPanel,
        infoFillOut: UserInfoFillOut,
        clickSuggestionPanel: ClickSuggestionPanel
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;