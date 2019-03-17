import { createStackNavigator, createAppContainer } from "react-navigation";

import UserLoginPanel from "../UserLoginPanel";
import UserSignupPanel from "../UserSignupPanel";
import ClickSuggestionPanel from "../ClickSuggestionPanel";
import UserInformationPanel from "../UserInformationPanel";
import RecipePanel from "../RecipePanel";
import ConfirmFoodPanel from "../ConfirmFoodPanel";
import YelpMapPanel from "../YelpMapPanel";

const AppStackNavigator = createStackNavigator(
    {
        loginPanel : UserLoginPanel,
        userSignupPanel: UserSignupPanel,
        clickSuggestionPanel: ClickSuggestionPanel,
        userInformationPanel: UserInformationPanel,
        confirmFoodPanel: ConfirmFoodPanel,
        recipePanel:RecipePanel,
        yelpMapPanel:YelpMapPanel
    },{
        initialRouteName: 'clickSuggestionPanel'
    }
)

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;