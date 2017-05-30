let INITIAL_STATE = {
    recipe_set: [],
    search_criteria: {},
    select_recipes: []
};

export default function reducer(state = INITIAL_STATE, action) {
    if (action.type === 'display-recipe-options') {
        return Object.assign({}, state, {
            recipe_set: action.payload
        });
    }
    return state;
};
