'use strict';

import { Dimensions } from "react-native";
import { ScreenOrientation } from 'expo';

let _orientation = ScreenOrientation.Orientation.ALL_BUT_UPSIDE_DOWN;

export default class Orientation {

    static get mode() {
        return _orientation;
    }

    static set mode( value ) {
        _orientation = value;
        ScreenOrientation.allowAsync(this.mode);
        return this.mode;
    }

    static get FREE() {
        return ScreenOrientation.Orientation.ALL_BUT_UPSIDE_DOWN;
    }

    static get LANDSCAPE() {
        return ScreenOrientation.Orientation.LANDSCAPE;
    }

    static get PORTRAIT() {
        return ScreenOrientation.Orientation.PORTRAIT;
    }

    static isFree() {
        return this.mode === this.FREE;
    }

    static isLandscape() {
        return this.mode === this.LANDSCAPE;
    }

    static isPortrait() {
        return this.mode === this.PORTRAIT;
    }

    static free() {
        this.mode = this.FREE;
    }

    static landscape() {
        this.mode = this.LANDSCAPE;
    }

    static portrait() {
        this.mode = this.PORTRAIT;
    }

    static get current() {
        const scr = Dimensions.get("window");
        if (scr.width > scr.height)
            return this.LANDSCAPE;
        else
            return this.PORTRAIT;
    }

    static fix() {
        return this.mode = this.current;
    }
}