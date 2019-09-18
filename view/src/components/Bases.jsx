import React from "react";

/**
 *
 * @param {Object} props
 * @param {Function} props.handler
 */
function Bases(props) {
  //style setting
  const containerStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    width: "100px"
  };
  const baseStyle = document.createElement("style");
  baseStyle.type = "text/css";
  baseStyle.innerHTML = `.base { 
        width:20px;
        height:20px;
        background-color: gray;
        transform: rotate(45deg);
      }`;
  document.getElementsByTagName("head")[0].appendChild(baseStyle);
  //style setting end

  return (
    <div id="bases" className="field-container" sytle="width: 30%;">
      <p>Bases</p>
      <div style={{height:5}}/>
      <div style={containerStyle}>
        <div id="second-base" className="base" onClick={props.handler} />
      </div>
      <div style={containerStyle}>
        <div id="third-base" className="base" onClick={props.handler} />
        <div id="first-base" className="base" onClick={props.handler} />
      </div>
    </div>
  );
}

export default Bases;
