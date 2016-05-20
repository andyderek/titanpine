import React from 'react';

class HousingForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentUserID: 1,
      interestsArray:['Music', 'Movies', 'Books', 'Fashion', 'Outdoors', 'Sports', 'Crafting', 'Gaming','Javascript','Ruby', 'Node', 'React', 'Angular', 'Express', 'MongoDB', 'Postgres','Redux'],
      houseInterests:[],
      amenitiesArray:['Washer', 'Dryer', 'Cats Allowed', 'Dogs Allowed', 'Dishwasher', 'Garage', 'Gym', 'Mailroom','Wifi', 'Meeting Room/Lounge'],
      houseAmenities:[]
    };
    this.addInterest = this.addInterest.bind(this);
    this.addAmenity = this.addInterest.bind(this);
    this.submit = this.submit.bind(this);
  }

  addInterest (value){
    if (this.state.houseInterests.includes(value)){
      this.state.houseInterests.forEach((interest, index, list) => {
        list.splice(index,1);
      });
    } else {
      this.state.houseInterests.push(value);
    }
  }

  addAmenity (value){
    if (this.state.houseAmenities.includes(value)){
      this.state.houseAmenities.forEach((interest, index, list) => {
        list.splice(index,1);
      });
    } else {
      this.state.houseAmenities.push(value);
    }
  }

  submit(e, name, heading, street, city, state, zipCode, price, dateStart, dateEnd, interests, mission, rules, vacancies, primary, amenities){
    e.preventDefault();

    fetch('http://localhost:3001/v1/house_listings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_id: this.state.currentUserID,
          house_name: name.value,
          heading: heading.value, 
          street_add: street.value,
          city: city.value,
          state: state.value,
          zipcode: zipCode.value,
          price: price.value,
          dates_avail: dateStart.value+' to '+dateEnd.value,
          house_interests: interests.value,
          house_mission: mission.value,
          house_rules: rules.value,
          vacancies: vacancies.value,
          primary_member: primary.value,
          amenities: amenities.value
      })
    }).then(response => {
      console.log(response);
    });
  }

  render(){
    return(
        <form onSubmit={e => this.submit(e, this.house_name, this.heading, this.street_add, this.city, this.stateName, this.zipCode, this.price, this.dates_start, this.dates_end, this.interests, this.house_mission, this.house_rules, this.vacancies, this.primary_member, this.amenities)}>
          <label>House Name:</label><br/>
            <input ref={input => this.house_name = input}/><br/>
          <label>Heading:</label><br/>
            <input ref={input => this.heading = input}/><br/>
          <label>Street Address:</label><br/>
            <input ref={input => this.street_add = input}/><br/>
          <label>City:</label><br/>
            <input ref={input => this.city = input}/><br/>
          <label>State:</label><br/>
            <input maxLength='2'ref={input => this.stateName = input}/><br/>
          <label>Zipcode:</label><br/>
            <input pattern="\d*" maxLength='5' min='0'ref={input => this.zipCode = input}/><br/>
          <label>Price:</label><br/>
            $<input type="number" name="currency" min="0" max="9999" step="0.01" ref={input => this.price = input}/>per night<br/>
          <label>Dates Available:</label><br/>
            <input type="date"ref={input => this.dates_start = input}/><input type="date"ref={input => this.dates_end = input}/><br/>
          <label>Interests:</label><br/>
            <input ref={input => this.interests = input}/><br/>
            <div>
            {this.state.interestsArray.map((value, i) => {
              return (
                <div key={i} className="checkbox">
                  <input type="checkbox" onChange={e => this.addInterest(value)} />
                  <span>{value}</span>
                </div>
                )
            })}
            </div><br/><br/><br/>
          <label>Mission Statement:</label><br/>
            <textarea ref={input => this.house_mission = input}/><br/>
          <label>House Rules:</label><br/>
            <textarea ref={input => this.house_rules = input}/><br/>
          <label>Number of Vacancies:</label><br/>
            <input type="number" min='0' ref={input => this.vacancies = input}/><br/>
          <label>Primary Member:</label><br/>
            <input ref={input => this.primary_member = input}/><br/>
          <label>Amenities:</label><br/>
            <input ref={input => this.amenities = input}/><br/>
            <div>
              {this.state.amenitiesArray.map((value, i) => {
              return (
                <div key={i} className="checkbox">
                  <input type="checkbox" onChange={e => this.addAmenity(value)} />
                  <span>{value}</span>
                </div>
                )
            })}
            </div><br/><br/><br/>
          <input id="housingSubmit" type="submit" value="Create House"/>
        </form>
      )
  }
}

export default HousingForm 