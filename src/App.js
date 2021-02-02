import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Form from "./components/Form";
import Person from "./components/Person";
import axios from "axios";

const API_URL = `http://localhost:3001/persons`;

const Notification = ({ popupNotificationType, popupNotificationMessage}) => {
  if (popupNotificationType === null) {
    return null
  }
  return (
    <div className={popupNotificationType}>
      {popupNotificationMessage}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [popupNotificationType, setPopupNotificationType] = useState(null)
  const [popupNotificationMessage, setPopupNotificationMessage] = useState(null)

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setPersons(res.data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const found = persons.find((person) => personObject.name === person.name);
    if (!found) {
      axios.post(API_URL, personObject).then((res) => {
        setPersons(persons.concat(res.data));
        setNewNumber("");
        setNewName("");
        setPopupNotificationType('success')
        setPopupNotificationMessage(`Added ${res.data.name} to the phonebook!`)
      });
    } else {
      console.log("personObject is ", personObject);
      if (personObject.number !== undefined) {
        const replaceNumber = window.confirm(
          `${personObject.name} is already added to phonebook, replace the old number with new one?`
        );
        if (replaceNumber) {
          axios
            .put(`${API_URL}/${found.id}`, {
              ...personObject,
              number: personObject.number,
            })
            .then((res) => {
              setPersons(
                persons.map((item) =>
                  item.id === found.id
                    ? { ...item, number: personObject.number }
                    : item
                )
              );
            });
        } else {
          <PopupNotification />
          setPopupNotificationType('error')
          setPopupNotificationMessage(`Person already exists on the list!`)
        }
      }
    }
  };

  const handleNumberInput = (e) => {
    setNewNumber(e.target.value);
  };

  const handleNameInput = (e) => {
    setNewName(e.target.value);
  };

  console.log(persons)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification popupNotificationType={popupNotificationType} popupNotificationMessage={popupNotificationMessage} />
      <h3>Add a new person</h3>
      <Form
        handleSubmit={handleSubmit}
        handleNumberInput={handleNumberInput}
        handleNameInput={handleNameInput}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers:</h3>
      <ul>
        {persons.map((person) => (
          <Person key={uuidv4()} person={person} onDeleteChange={setPersons} />
        ))}
      </ul>
    </div>
  );
};

export default App;
