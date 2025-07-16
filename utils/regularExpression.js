let getRegular = (type) => {
  let expressions = /%/;
  switch (type.toLowerCase().trim()) {
    case "password":
      expressions = /^(?=.[A-Za-z])(?=\D*\d)(?=.{8,}).*$/;
      break;
    case "username":
      expressions = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
      break;
    case "email":
      expressions = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      break;
  }
  return expressions;
};
export { getRegular };
