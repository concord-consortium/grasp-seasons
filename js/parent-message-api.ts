import iframePhone from 'iframe-phone';

export default class ParentMessageAPI {
  _iframeEndpoint: any;
  _scriptingAPI: any;
  constructor(scriptingAPI: any) {
    this._iframeEndpoint = iframePhone.getIFrameEndpoint();
    this._scriptingAPI = scriptingAPI;
  }

  connect() {
    this._setupMessages(this._iframeEndpoint, this._scriptingAPI);
    this._iframeEndpoint.initialize();
  }

  disconnect() {
    this._iframeEndpoint.disconnect();
  }

  _setupMessages(phone: any, scriptingAPI: any) {
    phone.addListener('setSimState', function (content: any) {
      scriptingAPI.setSimState(content);
    });

    phone.addListener('getSimState', function () {
      phone.post('simState', scriptingAPI.getSimState());
    });

    phone.addListener('observeSimState', function () {
      scriptingAPI.onSimStateChange(function () {
        phone.post('simState', scriptingAPI.getSimState());
      });
      // Initial value.
      phone.post('simState', scriptingAPI.getSimState());
    });

    phone.addListener('getSunrayAngle', function () {
      phone.post('sunrayAngle', scriptingAPI.getSunrayAngle());
    });

    phone.addListener('setPlayBtnDisabled', function (content: any) {
      scriptingAPI.setPlayBtnDisabled(content);
    });

    phone.addListener('setRotatingBtnDisabled', function (content: any) {
      scriptingAPI.setRotatingBtnDisabled(content);
    });
  }
}
