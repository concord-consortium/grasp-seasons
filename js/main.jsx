import React from 'react';
import ReactDOM from 'react-dom';
import Seasons from './components/seasons.jsx';
import ScriptingAPI from './scripting-api.js';
import ParentMessageAPI from './parent-message-api.js';
import '../css/main.css';

let seasonsComp = ReactDOM.render(<Seasons/>, document.getElementById('app'));
let scriptingAPI = new ScriptingAPI(seasonsComp);
let parentMessageAPI = new ParentMessageAPI(scriptingAPI);
parentMessageAPI.connect();
window.script = scriptingAPI;
