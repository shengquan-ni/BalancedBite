import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import UserSignupPanel from "../UserSignupPanel";
import ClickSuggestionPanel from "../ClickSuggestionPanel";
import UserInformationPanel from "../UserInformationPanel";
import ConfirmFoodPanel from "../ConfirmFoodPanel";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        userSignupPanel: UserSignupPanel,
        clickSuggestionPanel: ClickSuggestionPanel,
        userInformationPanel: UserInformationPanel,
        confirmFoodPanel: ConfirmFoodPanel
    },{
        initialRouteName: 'confirmFoodPanel'
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;