import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import UserSignupPanel from "../UserSignupPanel";
import ClickSuggestionPanel from "../ClickSuggestionPanel";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        signupPanel: UserSignupPanel,
        clickSuggestionPanel: ClickSuggestionPanel
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;