/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { fetchStudentThunk, 
  deleteStudentThunk } from "../../store/thunks";

import EditStudentView from '../views/EditStudentView';
import { editStudentThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
  // Initialize state

  componentDidMount() {
    //getting student ID from url
    this.props.fetchStudent(this.props.match.params.id);
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.
    //console.log("Studnet ID inside container", this.student.id)
    //ID is from here. 
    console.log("ID from props", this.props.match.params.id)
    console.log("The state of Student", this.state)
    let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        imageUrl: this.state.imageUrl,
        gpa: this.state.gpa,
        campusId: this.state.campusId,
        redirectId: this.props.match.params.id,
    };
    console.log("Props ID,", this.props.match.params.id)
    
    // Add new student in back-end database
    let newStudent = await this.props.editStudent(this.state);
    console.log("EDIT STUDENT IN CONTAINER", newStudent);
    console.log("Checking this props", this.props)

    // Update state, and trigger redirect to show the new student
    this.setState({
      firstname: this.state.firstname, 
      lastname: this.state.lastname, 
      email: this.state.email,
      imageUrl: this.state.imageUrl,
      gpa: this.state.gpa,
      campusId: this.state.campusId, 
      id: this.props.match.params.id,
      redirect: true, 
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {

    // Redirect to new student's page after submit
    // Display the input form via the corresponding View component
    /*
    if(!this.state.redirect) {
      return (<Link to={`/student/${this.props.match.params.id}`}/>)
    }
    */

    return (
      <div>
        <Header />
        <EditStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}     
          student={this.props.student}  
        />
      </div>          
    );
  }
}

const mapState = (state) => {
  return {
    student: state.student,  // Get the State object from Reducer "student"
  };
};
// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
        editStudent: (student) => dispatch(editStudentThunk(student)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);