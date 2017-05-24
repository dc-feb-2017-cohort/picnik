import $ from 'jquery';
import testResponse from './recipes.js';

const displayRecipes = (results) => {
    return {type: 'display-recipe-options', payload: results};
};

export const getRecipe = (search_params) => {
    let asyncAction = function(dispatch) {
        $.ajax({
            url: "http://api.yummly.com/v1/api/recipes?_app_id=cf10df74&_app_key=46a91a122338f6df55213530c127f027&maxResult=100",
            method: "GET",
            dataType: 'JSON'
        })
        .then((results) => {
            return results.filter((recipe) => {
                console.log(recipe);
                return (recipe.flavors !== null) /*&& (recipe.cuisine !== undefined && (recipe.smallImageUrls !== undefined)*/;
            });
        })
        .then((results) => dispatch(displayRecipes(results)))
        .catch(error =>  {throw error});
    };
    return asyncAction;
};

export const getTestRecipes = (taste_prefs_from_signup_state, cuisine_prefs_from_signup_state) => {
    let taste = taste_prefs_from_signup_state;
    let cuisine = cuisine_prefs_from_signup_state;
    let asyncAction = function(dispatch) {
        let t = testResponse.testResponse.matches.filter((recipe) => {
            return (recipe.flavors !== null)
            && (recipe.smallImageUrls !== undefined);
        });
        let t2 = t.map(recipe => { //adds user preferred class to beers that matched the recommended pairings for the selected dish
            let classes = "recipe";
            let cuisine_class = "";
            if ((recipe.flavors.sweet <= (taste.sweet / 3)) && (recipe.flavors.sweet >= ((taste.sweet / 3) - 0.33))) {
                classes += " user-preferred-recipe";
            } else if ((recipe.flavors.salty <= (taste.salty / 3)) && (recipe.flavors.salty >= ((taste.salty / 3) - 0.33))) {
                classes += " user-preferred-recipe";
            } else if ((recipe.flavors.meaty <= (taste.meaty / 3)) && (recipe.flavors.meaty >= ((taste.meaty / 3) - 0.33))) {
                classes += " user-preferred-recipe";
            } else if ((recipe.flavors.bitter <= (taste.bitter / 3)) && (recipe.flavors.bitter >= ((taste.bitter / 3) - 0.33))) {
                classes += " user-preferred-recipe";
            } else if ((recipe.flavors.sour_taste <= (taste.sour_taste / 3)) && (recipe.flavors.sour_taste >= ((taste.sour_taste / 3) - 0.33))) {
                classes += " user-preferred-recipe";
            } else if ((recipe.flavors.piquant <= (taste.piquant / 3)) && (recipe.flavors.piquant >= ((taste.piquant / 3) - 0.33))) {
                classes += " user-preferred-recipe";
            } if (recipe.attributes.cuisine) { //cuisine test (adds picnic basket icon if cuisine of recipe is a user favorite)
                if (recipe.attributes.cuisine) {
                    if (cuisine.mexican && (recipe.attributes.cuisine[0] === "Mexican") || (recipe.attributes.cuisine[1] === "Mexican") || (recipe.attributes.cuisine[2] === "Mexican")) {
                    cuisine_class += "cuisine-matched-recipe";
                    } else if (cuisine.italian && (recipe.attributes.cuisine[0] === "Italian") || (recipe.attributes.cuisine[1] === "Italian") || (recipe.attributes.cuisine[2] === "Italian")) {
                    cuisine_class += "cuisine-matched-recipe";
                    } else if (cuisine.mediterranean && (recipe.attributes.cuisine[0] === "Mediterranean") || (recipe.attributes.cuisine[1] === "Mediterranean") || (recipe.attributes.cuisine[2] === "Mediterranean")) {
                    cuisine_class += "cuisine-matched-recipe";
                    } else if (cuisine.thai && (recipe.attributes.cuisine[0] === "Thai") || (recipe.attributes.cuisine[1] === "Thai") || (recipe.attributes.cuisine[2] === "Thai")) {
                    cuisine_class += "cuisine-matched-recipe";
                    } else if (cuisine.barbecue && (recipe.attributes.cuisine[0] === "Barbecue") || (recipe.attributes.cuisine[1] === "Barbecue") || (recipe.attributes.cuisine[2] === "Barbecue")) {
                    cuisine_class += "cuisine-matched-recipe";
                    } else if (cuisine.american && (recipe.attributes.cuisine[0] === "American") || (recipe.attributes.cuisine[1] === "American") || (recipe.attributes.cuisine[2] === "American")) {
                    cuisine_class += "cuisine-matched-recipe";
                    } else if (cuisine.japanese && (recipe.attributes.cuisine[0] === "Japanese") || (recipe.attributes.cuisine[1] === "Japanese") || (recipe.attributes.cuisine[2] === "Japanese")) {
                    cuisine_class += "cuisine-matched-recipe";
                    } else if (cuisine.chinese && (recipe.attributes.cuisine[0] === "Chinese") || (recipe.attributes.cuisine[1] === "Chinese") || (recipe.attributes.cuisine[2] === "Chinese")) {
                    cuisine_class += "cuisine-matched-recipe";
                    }
                }
            }
            recipe.class = classes;
            recipe.cuisine_class = cuisine_class;
            return recipe;
        });
        testResponse.testResponse.matches = t2;
        console.log(testResponse.testResponse);
        dispatch(displayRecipes(testResponse.testResponse));
    };
    return asyncAction;
}

export const selectRecipe = (item) => { //we pass the entire recipe object into the function so we can save it to the select_recipes array in the state
    return {type: 'select-recipe', item};
};

//beer ------------------------->

const displayBeers = (results) => {
    return {type: 'display-beer-options', payload: results};
};

export const beerPairingMegaFunction = (beer_prefs_from_signup_state, selected_recipe) => {
    let asyncAction = function(dispatch) {
        $.ajax({
            url: "http://api.brewerydb.com/v2/beers?key=30fae795a155ea7f3a8401417c570efe&availableId=1&hasLabels=Y&withBreweries=Y",
            method: "GET",
            dataType: 'JSON'
        })
        .then((api_beer_data) => {
            let disliked_beers_checker = userPreferenceBeerFilter(beer_prefs_from_signup_state);
            let beers_filtered_based_on_prefs = api_beer_data.data.filter(beer => { // uses disliked_beers array to compare against the returned array of objects from the api call, and returns only the beers that don't match the disliked beers array
                if (disliked_beers_checker.length > 0) {
                    return (!disliked_beers_checker.includes(beer.styleId));
                }
                else {
                    return beer;
                }
            });
            return beers_filtered_based_on_prefs;
        })
        .then((beers_filtered_based_on_prefs) => {
            let final_beer_set = beers_filtered_based_on_prefs.map(beer => { //adds paired-beer class to beers that matched the recommended pairings for the selected dish
                let classes = "beer";
                let smart_pairings = beerPairingEngine(selected_recipe);
                if (smart_pairings!== "No matches") {
                    if (smart_pairings.includes(beer.styleId)) {
                    classes += " paired-beer";
                    }
                }
                beer.class = classes;
                return beer;
            });
            return final_beer_set;
        })
        .then((final_beer_set) => dispatch(displayBeers(final_beer_set)))
        .catch(error =>  {throw error});
    };
    return asyncAction;
}

const userPreferenceBeerFilter = (beer_prefs_from_signup_state) => { //filters out the corresponding styleids of the beer styles the user dislikes and returns the ids in an array
    var brewerydb_style_ids = { //associated style ids for each beer style from brewerydb API
        ipa: [2, 26, 29, 30, 31],
        pale_ale: [25, 73, 74, 164, 27, 1],
        lager: [77, 78, 79, 80, 81, 82, 83, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103],
        belgian: [59],
        sours: [40, 46, 47, 66, 67, 68, 136, 165],
        stout: [16, 20, 21, 42, 43],
        porter: [18, 19, 158],
        pilsner: [75, 76, 106, 98],
        saison: [72],
        wheat: [65, 48, 49, 50, 51, 52, 53, 112, 113, 114, 115, 116]
    };
    let user_dislikes =[];
    for (var key in beer_prefs_from_signup_state) {
        if (beer_prefs_from_signup_state[key] === false) {
            user_dislikes = user_dislikes.concat(brewerydb_style_ids[key]);
        }
    }
    return user_dislikes;
};

const beerPairingEngine = (selected_recipe) => {
    let flavor_profile = selected_recipe.flavors === null ? {
        //return empty object if flavor profile doesn't exist for recipe
    } : selected_recipe.flavors;
    let course = selected_recipe.attributes.course;
    let cuisine_final = selected_recipe.cuisine ? selected_recipe.cuisine.map(item => {
        return item.toLowerCase();
    }) : "";
    let ingredient_list = selected_recipe.ingredients.map(item => {
        return item.split(" ");
    });
    let ingredient_list_final = ingredient_list.join();

    if (flavor_profile.piquant > .7) { //spicy food
        return [2, 26, 29, 30, 31, 25, 72, 73, 74, 164, 27, 1, 65, 48, 49, 50, 51, 52, 53, 112, 113, 114, 115, 116]; //IPA, pale ale, hefeweizen, saison

    } else if (course.includes("Desserts")) {
        return [13, 16, 20, 21, 42, 43, 17, 34, 68, 119, 121, 122, 167]; //stout, barleywine, old ale, fruit lambic, fruit beer, pumpkin beer, chocolate beer

    } else if (flavor_profile.piquant < .2 && flavor_profile.sweet > .7) { //sweet non-spicy food
        return [13, 16, 20, 21, 42, 43, 17, 34, 68, 119, 121, 122, 167]; //stout, barleywine, old ale, fruit lambic, fruit beer, pumpkin beer, chocolate beer

    } else if (flavor_profile.piquant < .2 && flavor_profile.salty > .7) { //salty non-spicy food
        return [77, 78, 79, 80, 81, 82, 83, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 25, 73, 74, 164, 27, 1, 40, 46, 47, 66, 67, 68, 136, 165]; //lager, "pale_ale", "sours"

    } else if (cuisine_final.includes("barbecue") && !ingredient_list_final.includes('chicken') && ingredient_list_final.includes('beef') || ingredient_list_final.includes('pork') && flavor_profile.piquant < .7) { //non-poultry bbq
        return [16, 20, 21, 42, 43, 18, 19, 158, 90]; //"stout", "porter", "doppelbock"

    } else if (ingredient_list_final.includes('roast') &&  ingredient_list_final.includes('pot') && flavor_profile.piquant < .7) { //heavy pot roasts
        return [16, 20, 21, 42, 43, 18, 19, 158, 90]; //"stout", "porter", "doppelbock"

    } else if (cuisine_final.includes("barbecue") && ingredient_list_final.includes('chicken') && !ingredient_list_final.includes('beef') && !ingredient_list_final.includes('pork') && flavor_profile.piquant < .7) { //poultry bbq
        return [77, 78, 79, 80, 81, 82, 83, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 25, 73, 74, 164, 27, 1, 40, 46, 47, 66, 67, 68, 136, 165]; //lager, "pale_ale", "sours"

    } else if (cuisine_final.includes("asian") || cuisine_final.includes("japanese") || cuisine_final.includes("chinese") || cuisine_final.includes("thai") && flavor_profile.piquant < .7) { //non-spicy asian
        return [77, 78, 79, 80, 81, 82, 83, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 65, 48, 49, 50, 51, 52, 53, 112, 113, 114, 115, 116, 40, 46, 47, 66, 67, 68, 136, 165]; //"lager", "hefeweizen", "gose"

    } else if (cuisine_final.includes("italian") && flavor_profile.piquant < .7) { //italian food
        return [77, 78, 79, 80, 81, 82, 83, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 25, 73, 74, 164, 27, 1]; //"lager", "pale_ale"

    } else if (cuisine_final.includes("mediterranean") && flavor_profile.piquant < .7) { //mediterranean food
        return [59, 77, 78, 79, 80, 81, 82, 83, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 25, 73, 74, 164, 27, 1]; //lager, pale ale, tripel

    } else if (cuisine_final.includes("american") && ingredient_list_final.includes("salmon") || ingredient_list_final.includes("fish") || ingredient_list_final.includes("tilapia") || ingredient_list_final.includes("lobster") || ingredient_list_final.includes("shrimp") || ingredient_list_final.includes("crab")) { //american seafood
        return [77, 78, 79, 80, 81, 82, 83, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 65, 48, 49, 50, 51, 52, 53, 112, 113, 114, 115, 116, 72, 45]; //'lager', 'hefeweizen', 'saison', 'kolsch'
    } else {
        return "No matches";
    };
}
