import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import update, { Spec } from "immutability-helper";
import ViewManager from "./view-manager";
import Slider from "./slider/slider";
import InfiniteDaySlider from "./slider/infinite-day-slider";
import CitySelect from "./city-select";
import AnimationCheckbox from "./animation-checkbox";
import AnimationButton from "./animation-button";
import getURLParam from "../utils/utils";
import t, { Language } from "../translation/translate";
import { ISimState, IViewState, ViewType } from "../types";
import CCLogoImg from "../assets/concord-consortium.png";

import "./seasons.scss";

interface IState {
  sim: ISimState;
  view: IViewState;
}

const ANIM_SPEED = 0.02;
const DAILY_ROTATION_ANIM_SPEED = 0.0003;
const ROTATION_SPEED = 0.0004;
const DEFAULT_STATE: IState = {
  sim: {
    day: 171,
    earthTilt: true,
    earthRotation: 1.539,
    sunEarthLine: true,
    lat: 40.11,
    long: -88.2,
    sunrayColor: "#D8D8AC",
    groundColor: "#4C7F19", // 'auto' will make color different for each season
    sunrayDistMarker: false,
    dailyRotation: false,
    earthGridlines: false,
    lang: "en_us"
  },
  view: {
    "main": "orbit",
    "small-top": "raysGround",
    "small-bottom": "nothing"
  }
};

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface IProps {
  lang?: Language;
  initialState?: Partial<IState>;
  logHandler?: (action: string, data: any) => void;
}

const Seasons: React.FC<IProps> = ({ lang = "en_us", initialState = {}, logHandler }) => {
  const playButtonRef = useRef<AnimationButton>(null);
  const rotatingButtonRef = useRef<AnimationCheckbox>(null);
  const viewRef = useRef<any>(null);

  const [state, setState] = useState<IState>({
    ...DEFAULT_STATE,
    ...initialState,
    sim: {
      ...DEFAULT_STATE.sim,
      ...initialState.sim,
      lang: lang || (getURLParam("lang") as Language) || DEFAULT_STATE.sim.lang
    }
  });

  const simLang = state.sim.lang;
  const earthVisible = Object.values(state.view).indexOf("earth") > -1;

  const log = (action: string, data?: any) => {
    logHandler?.(action, data);
  };

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      sim: {
        ...prevState.sim,
        lang
      }
    }));
  }, [lang]);

  useEffect(() => {
    lookAtSubsolarPoint();
  }, []);

  useEffect(() => {
    log("ViewsRearranged", state.view);
  }, [state.view]);

  const getMonth = (date: Date) => {
    const monthNames = t("~MONTHS", lang);
    return monthNames[date.getMonth()];
  };

  const getFormattedDay = () => {
    const date = new Date(2015, 0);
    date.setDate(state.sim.day + 1);
    return `${getMonth(date)} ${date.getDate()}`;
  };

  const getFormattedLat = () => {
    let dir = "";
    const lat = state.sim.lat;
    if (lat > 0) dir = t("~DIR_NORTH", simLang);
    else if (lat < 0) dir = t("~DIR_SOUTH", simLang);
    const latitude = Math.abs(lat).toFixed(2);
    return `${latitude}°${dir}`;
  };

  const getFormattedLong = () => {
    let dir = "";
    const lng = state.sim.long;
    if (lng > 0) dir = t("~DIR_EAST", simLang);
    else if (lng < 0) dir = t("~DIR_WEST", simLang);
    const long = Math.abs(lng).toFixed(2);
    return `${long}°${dir}`;
  };

  const getAnimSpeed = () => {
    return state.sim.dailyRotation ? DAILY_ROTATION_ANIM_SPEED : ANIM_SPEED;
  };

  const setSimState = (newSimState: Partial<ISimState>, callback?: () => void, skipEvent = false) => {
    const updateStruct: Spec<ISimState> = {};
    let key: keyof ISimState;
    for (key in newSimState) {
      if (newSimState[key] !== state.sim[key]) {
        updateStruct[key] = { $set: newSimState[key] } as any;
      }
    }
    if (Object.keys(updateStruct).length === 0) {
      return;
    }
    setState(prevState => {
      const newState = update(prevState.sim, updateStruct);
      return { ...prevState, sim: newState };
    });
  };

  const simStateChange = (newState: Partial<ISimState>) => {
    setSimState(newState);
  };

  const viewChange = (viewPosition: keyof IViewState, viewName: ViewType) => {
    const updateStruct: Spec<IViewState> = {};
    updateStruct[viewPosition] = { $set: viewName };
    if (viewName !== "nothing") {
      const oldView = state.view[viewPosition];
      for (const key in state.view) {
        if (state.view[key as keyof IViewState] === viewName) {
          updateStruct[key as keyof IViewState] = { $set: oldView };
        }
      }
    }
    setState(prevState => {
      const newState = update(prevState.view, updateStruct);
      return { ...prevState, view: newState };
    });
  };

  const daySliderChange = (event: any, ui: any) => {
    setSimState({ day: ui.value });
  };

  const dayAnimFrame = (newDay: number) => {
    const stateUpdate: Partial<ISimState> = { day: newDay % 365 };
    if (state.sim.dailyRotation) {
      stateUpdate.earthRotation = (newDay % 1) * 2 * Math.PI;
    }
    setSimState(stateUpdate);
  };

  const earthRotationAnimFrame = (newAngle: number) => {
    setSimState({ earthRotation: newAngle % (2 * Math.PI) });
  };

  const simCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSimState: Partial<ISimState> = {
      [event.target.name as any as keyof ISimState]: event.target.checked
    };
    setSimState(newSimState);
    logCheckboxChange(event);
  };

  const logCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    log(capitalize(event.target.name) + "CheckboxChanged", {
      value: event.target.checked
    });
  };

  const logButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    log(capitalize(event.currentTarget.name) + "ButtonClicked");
  };

  const latSliderChange = (event: any, ui: any) => {
    setSimState({ lat: ui.value });
  };

  const longSliderChange = (event: any, ui: any) => {
    setSimState({ long: ui.value });
  };

  const citySelectChange = (lat: number, long: number, city: string) => {
    const rot = -long * Math.PI / 180;
    setSimState({ lat, long, earthRotation: rot }, () => {
      viewRef.current?.lookAtLatLongMarker();
    });
    log("CityPulldownChanged", {
      value: city,
      lat,
      long
    });
  };

  const lookAtSubsolarPoint = () => {
    viewRef.current?.lookAtSubsolarPoint();
    setSimState({ earthRotation: (11.5 - state.sim.long) * Math.PI / 180 });
  };

  const subpolarButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    lookAtSubsolarPoint();
    logButtonClick(event);
  };

  return (
    <div className="grasp-seasons">
      <ViewManager
        ref={viewRef}
        view={state.view}
        simulation={state.sim}
        onSimStateChange={simStateChange}
        onViewChange={viewChange}
        log={log}
      />
      <div className="controls">
        <div className="left-col">
          <div className="form-group">
            <AnimationButton
              ref={playButtonRef}
              speed={getAnimSpeed()}
              currentValue={state.sim.day}
              lang={simLang}
              onAnimationStep={dayAnimFrame}
              onClick={logButtonClick}
            />
            <label>
              <input
                type="checkbox"
                name="dailyRotation"
                checked={state.sim.dailyRotation}
                onChange={simCheckboxChange}
              />
              { t("~DAILY_ROTATION", simLang) }
            </label>
            <label className="day">{ t("~DAY", simLang) }: { getFormattedDay() }</label>
            <div className="day-slider">
              <InfiniteDaySlider
                value={state.sim.day}
                slide={daySliderChange}
                lang={simLang}
                log={log}
                logId="Day"
              />
            </div>
          </div>
          <div className="form-group pull-left">
            <CitySelect
              lat={state.sim.lat}
              long={state.sim.long}
              lang={simLang}
              onCityChange={citySelectChange}
            />
            <div className="earth-gridlines-toggle"></div>
          </div>
        </div>
        <div className="right-col">
          <button className="btn btn-default" onClick={subpolarButtonClick} name="ViewSubpolarPoint">
            { t("~VIEW_SUBSOLAR_POINT", simLang) }
          </button>
          <div className="long-lat-sliders">
            <div className="form-group">
              <label>{ t("~LATITUDE", simLang) }: { getFormattedLat() }</label>
              <Slider
                value={state.sim.lat}
                min={-90}
                max={90}
                step={1}
                slide={latSliderChange}
                log={log}
                logId="Latitude"
              />
            </div>
            <div className="form-group">
              <label>{ t("~LONGITUDE", simLang) }: { getFormattedLong() }</label>
              <Slider
                value={state.sim.long}
                min={-180}
                max={180}
                step={1}
                slide={longSliderChange}
                log={log}
                logId="Longitude"
              />
            </div>
          </div>
          <div className="checkboxes">
            <label>
              <AnimationCheckbox
                ref={rotatingButtonRef}
                speed={ROTATION_SPEED}
                currentValue={state.sim.earthRotation}
                onAnimationStep={earthRotationAnimFrame}
                name="EarthRotation"
                onChange={logCheckboxChange}
              />
              { t("~ROTATING", simLang) }
            </label>
            <label>
              <input
                type="checkbox"
                name="earthTilt"
                checked={state.sim.earthTilt}
                onChange={simCheckboxChange}
              />
              { t("~TILTED", simLang) }
            </label>
            <label>
              <input
                type="checkbox"
                name="sunEarthLine"
                checked={state.sim.sunEarthLine}
                onChange={simCheckboxChange}
              />
              { t("~SUN_EARTH_LINE", simLang) }
            </label>
            { earthVisible && (
              <label>
                <input
                  type="checkbox"
                  name="earthGridlines"
                  checked={state.sim.earthGridlines}
                  onChange={simCheckboxChange}
                />
                { t("~EARTH_GRIDLINES", simLang) }
              </label>
            ) }
          </div>
        </div>
      </div>
      <footer className="page-footer">
        <section>
          <a
            className="cc-brand"
            href="http://concord.org/"
            target="_blank"
            title="The Concord Consortium - Revolutionary digital learning for science, math and engineering"
            rel="noreferrer"
          >
            <img src={CCLogoImg} alt="The Concord Consortium" />
          </a>
          <p>&copy; Copyright 2024 The Concord Consortium</p>
        </section>
      </footer>
    </div>
  );
};

export default Seasons;
