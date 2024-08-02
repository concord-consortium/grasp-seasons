import React from "react";
import ReactDOM from "react-dom";
import Seasons from "./components/seasons";
import ScriptingAPI from "./utils/scripting-api";
import ParentMessageAPI from "./utils/parent-message-api";

// eslint-disable-next-line react/no-render-return-value, react/no-deprecated, import/no-named-as-default-member
const seasonsComp = ReactDOM.render(<Seasons/>, document.getElementById("app"));
const scriptingAPI = new ScriptingAPI(seasonsComp);
const parentMessageAPI = new ParentMessageAPI(scriptingAPI);
parentMessageAPI.connect();
(window as any).script = scriptingAPI;
