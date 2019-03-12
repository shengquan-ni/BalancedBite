// get the current user name from the redux store, and put it
//  into a new props call 'currentUserName'
export const mapStateToProps = (state) => {
    return {
        currentToken : state.currentToken
    }
}

// action dispatcher to change the state of the redux store. This will
//  pass type and name to the reduce in App.js, where the actual change
//  will occur.
export const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentToken: (token) => dispatch({type : 'CHANGE_TOKEN', token: token})
    }
}