import React from 'react';
import ReactDOM from 'react-dom';
import Seasons from './components/seasons';
import ScriptingAPI from './utils/scripting-api';
import ParentMessageAPI from './utils/parent-message-api';

let seasonsComp = ReactDOM.render(<Seasons/>, document.getElementById('app'));
let scriptingAPI = new ScriptingAPI(seasonsComp);
let parentMessageAPI = new ParentMessageAPI(scriptingAPI);
parentMessageAPI.connect();
(window as any).script = scriptingAPI;
