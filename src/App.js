import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Form from "./components/Form";
import Person from "./components/Person";
import Notification from "./components/Notification";
import axios from "axios";

const API_URL = `http://localhost:3001/persons`;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [popupNotificationType, setPopupNotificationType] = useState(null);
  const [popupNotificationMessage, setPopupNotificationMessage] = useState(
    null
  );

  const handlePopupMessages = (type, msg) => {
    setPopupNotificationType(type);
    setPopupNotificationMessage(msg);

    setTimeout(() => {
      setPopupNotificationType(null);
      setPopupNotificationMessage(null);
    }, 5000);
  };

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
      axios
        .post(API_URL, personObject)
        .then((res) => {
          setPersons(persons.concat(res.data));
          setNewNumber("");
          setNewName("");
          handlePopupMessages(
            "success",
            `Added ${res.data.name} to the phonebook!`
          );
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
            })
            .catch(err => handlePopupMessages('error', `User ${personObject.name} was already removed from the server!`))
          } else {
          handlePopupMessages(
            "error",
            "This person already exists in our records!"
          );
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

  console.log(persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        type={popupNotificationType}
        message={popupNotificationMessage}
        handle={handlePopupMessages}
      />
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
