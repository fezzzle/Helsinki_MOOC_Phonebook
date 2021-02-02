const Notification = ({ type, message, handle }) => {

  if (type === null) {
    return null;
  }
  return (
    <div className={type}>{message}</div>
  );
};

export default Notification;
