import "./Input.css";

const Input = (props) => {
  return (
    <div className="input">
      <label>{props.label}</label>
      <input
        className={props.valid ? "" : "invalid"}
        placeholder={props.placeholder}
        type={props.type}
        onChange={props.onChange}
        value={props.value}
        required
      ></input>
    </div>
  );
};

export default Input;
