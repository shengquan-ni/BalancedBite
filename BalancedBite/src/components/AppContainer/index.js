import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import ClickSuggestionPanel from "../ClickSuggestionPanel";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        clickSuggestionPanel: ClickSuggestionPanel
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;