const Form = ({ handleSubmit, handleNameInput, handleNumberInput, newName, newNumber}) => {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div>
            Name: <input value={newName} placeholder="Name" onChange={handleNameInput} />
          </div>
          <div>
            Number: <input value={newNumber} placeholder="53001234" onChange={handleNumberInput} />
          </div>
          <div>
            <button type="submit">Add</button>
          </div>
        </form>
      </>
    );
  };
  
export default Form