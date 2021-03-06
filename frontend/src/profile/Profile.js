import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './Profile.actions';
import {hashHistory} from 'react-router';


class Profile extends React.Component {
    componentDidMount() {
        if (this.props.login.user_id) {
            this.props.displayPicniksActionCreator(this.props.login);
            // this.props.loadSavedBeersToProfile(this.props.login);
            // this.props.loadSavedWinesToProfile(this.props.login);
            // this.props.loadSavedRecipesToProfile(this.props.login);
        }
    }
    componentWillReceiveProps(new_props) {
        if (new_props.login.user_id !== this.props.login.user_id) {
            // this.props.loadSavedBeersToProfile(new_props.login);
            // this.props.loadSavedWinesToProfile(new_props.login);
            // this.props.loadSavedRecipesToProfile(new_props.login);
            this.props.displayPicniksActionCreator(new_props.login);
        }
    }
  render() {
    return (
        <div className="profile">
            <div className="saved_items">
                <div className="saved_items_title">My Saved Picniks</div>
                {this.props.profile.saved_picniks.map((picnik, index) => (
                    <div className="saved-picnik" key={index}>
                        <div className="saved-picnik-details">
                            Date: {picnik.date_of}<br/><br/>
                            Time: {picnik.time_of}<br/><br/>
                            Park: {(picnik.park && picnik.park[0]) ? (picnik.park[0].name) : ""}<br/><br/>
                            Address: {(picnik.park && picnik.park[0]) ? (picnik.park[0].address) : ""}<br/><br/>
                        </div>
                        Recipes:<div className="saved-picnik-recipe-details">
                            {picnik.recipes.length > 0 ? picnik.recipes.map((recipe, index) => {
                                return <div key={index}>
                                            {recipe.name}

                                        </div>
                            }) : "No recipes were selected for this picnik."}
                        </div>
                        Beers:{(picnik.beers && picnik.beers[0] && picnik.beers[0].length > 0) ? picnik.beers[0].map((beer, index) => {
                            return <div className="saved-picnik-beer-details" key={index}>
                                         <br/><br/> {beer.beer_name}

                                    </div>
                        }) : "No beers were selected for this picnik."}

                        Wines: {(picnik.wines && picnik.wines[0] && picnik.wines[0].length > 0) ? picnik.wines[0].map((wine, index) => {
                            return <div className="saved-picnik-wine-details" key={index}>
                                         <br/><br/>{wine.name}
                                    </div>
                        }) : "No wines were selected for this picnik."}

                        <div className='profile-buttons' onClick={() => {this.props.loadPicnikToPlanning( this.props.profile.saved_picniks[index]);hashHistory.push('/invitations')}}>View and Send Invites</div>
                    </div>
                ))}
            </div>

        </div>
      );
  }
}

const ProfileContainer = ReactRedux.connect(
  state => ({ profile: state.profile, login: state.login }),
  actions
)(Profile);

export default ProfileContainer;
