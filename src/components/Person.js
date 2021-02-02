import axios from "axios";

const Person = ({ person, onDeleteChange }) => {
  const API_URL = `http://localhost:3001/persons/`;
  const deletePersonElement = () => {
    const confirmDelete = window.confirm("Do you wish to delete this record?")
    if (confirmDelete) {
      axios
      .delete(`${API_URL}${person.id}`)
      .then(res => {
        axios.get(API_URL).then(res => onDeleteChange(res.data))
      })
    }
  }
  return (
    <>
      <li>
        {person.name}:&nbsp;{person.number}
        &nbsp;<button onClick={deletePersonElement}>Delete</button>
      </li>
    </>
  );
};

export default Person;
