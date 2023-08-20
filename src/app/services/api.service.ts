import {Injectable} from '@angular/core';
import {io} from "socket.io-client";
import {BackendStatusInterface} from "../util/BackendStatus.interface";
import {MeasurementInterface, MeasurementMetadata, MeasurementValue} from "../util/Measurement.interface";
import {MatSnackBar} from "@angular/material/snack-bar";
import unmuteIosAudio from "unmute-ios-audio";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  statusValue: BackendStatusInterface = {
    MEASUREMENT_ACTIVE: false,
    PAUSE_ACTIVE: false,
    BATTERY_LEVEL: 0,
    MEASUREMENT_VALUE: 0,
    LIMIT_VALUE: 0,
    CALI_ACTIVE: false,
    CALI_DIST_MES_ACTIVE: false,
    MEASUREMENT_DISTANCE: 0,
    WATCH_DOG: false
  }

  measurementValues: MeasurementValue[] = []
  public socket;
  public sound_on: boolean = false

  constructor(private snackBar: MatSnackBar) {
    unmuteIosAudio()
    this.actualize_sound_on()
    this.socket = io("https://192.168.4.1:5000", {transports: ['websocket'], secure:true})
    //this.socket = io("127.0.0.1:5000", {transports: ['websocket']})

    this.socket.on('connect', () => console.log("Backend connected")
    )
    this.socket.on('status', (data) => {
      this.statusValue = data
    })
    this.socket.on('value', (data) => {
      for (let i = 0; i < data.length; i++) {
        this.measurementValues.push(data[i])
      }
    })
    this.socket.on('error', (data) => {
      this.openSnackbar_success('ERROR: ' + data)
    })
    this.socket.on('info', (data) => {
      this.openSnackbar_success('INFO: ' + data)
    })

    this.socket.on('beep', () => {
      if (this.sound_on) {
        this.beep()
      }
    })
  }

  getStatusValue(key: string): any {
    return this.statusValue[key as keyof BackendStatusInterface]
  }

  getMeasurementValues(): MeasurementValue[] {
    return this.measurementValues
  }

  /**
   * Chart Actions
   */
  public start_measuring() {
    this.socket.emit('chart:start:measuring', {timestamp: Math.round(Date.now() / 1000)}, (response: string) => {
    })
  }

  public stop_measuring() {
    this.socket.emit('chart:stop:measuring', (response: string) => {
    })
  }

  public start_pause() {
    this.socket.emit('chart:start:pause', (response: string) => {
    })
  }

  public stop_pause() {
    this.socket.emit('chart:stop:pause', (response: string) => {
    })
  }

  public add_comment(comment: string) {
    this.socket.emit('chart:add:comment', ({comment: comment}), (response: string) => {
    })
  }

  public set_metadata(name: string, user: string, location: string, notes: string, street_width: number) {
    this.socket.emit('chart:set:metadata', ({
      metaData: {
        name: name,
        user: user,
        location: location,
        notes: notes,
        time: Date.now().toPrecision(),
        streedwidth: street_width
      }
    }), (response: string) => {
    })
  }

  public async get_limit_value(): Promise<number> {
    let socket = this.socket
    return new Promise(function (resolve, reject) {
      socket.emit('chart:get:limitvalue', (response: number) => {
        return resolve(response)
      })
    })
  }

  public set_limit_value(limitValue: number) {
    this.socket.emit('chart:set:limitvalue', (limitValue), (response: string) => {
    })
  }

  /**
   * Data Actions
   */
  public async get_measurement(tableName: string, withComments: boolean): Promise<any> {
    let socket = this.socket
    return await new Promise(function (resolve, reject) {
      socket.emit('data:get:measurement', ({
        tableName: tableName,
        withComments: withComments
      }), (response: MeasurementInterface) => {
        return resolve(response)
      })
    })
  }

  public async get_all_tables(): Promise<MeasurementMetadata[]> {
    let socket = this.socket
    return new Promise(function (resolve, reject) {
      socket.emit('data:get:allTables', (response: MeasurementMetadata[]) => {
        return resolve(response)
      })
    })
  }

  public delete_table(tableName: string) {
    this.socket.emit('data:delete:table', tableName, (response: string) => {
    })
  }

  public update_metadata(tableName: string, name: string, user: string, location: string, notes: string) {
    this.socket.emit('data:set:metadata', ({
      tableName: tableName,
      metaData: {name: name, user: user, location: location, notes: notes}
    }), (response: string) => {
    })
  }

  /**
   * Settings Actions
   */

  public async get_all_quick_com_buttons(): Promise<string[]> {
    let socket = this.socket
    return new Promise(function (resolve, reject) {
      socket.emit('settings:get:commentBtns', (response: string[]) => {
        return resolve(response)
      })
    })
  }

  public add_quick_com_button(content: string) {
    let socket = this.socket
    socket.emit('settings:add:commentBtn', (content), (response: string) => {
    })
  }

  public delete_quick_com_button(content: string) {
    this.socket.emit('settings:delete:commentBtn', (content), (response: string) => {
    })
  }

  /**
   * Calibration Actions
   */

  public getCalibrationSteps(password: string): Promise<number[]> {
    let socket = this.socket
    return new Promise(function (resolve, reject) {
      socket.emit('settings:start:calibration', (password), (response: string) => {
        if (response.includes('wrong password')) {
          reject('Wrong Password')
        } else {
          return resolve(JSON.parse(response))
        }
      })
    })
  }

  public stopCalibration() {
    this.socket.emit('settings:stop:calibration')
  }

  public abortCalibration() {
    this.socket.emit('settings:abort:calibration')
  }

  public setCalibrationStep(step: number, password: string) {
    this.socket.emit('settings:set:calibrationStep', ({step: step, password: password}), (response: string) => {
      return response
    })
  }

  public startCalibrationDistanceMeasuring(password: string) {
    this.socket.emit('settings:start:calibration:measurement', (password), (response: string) => {
      return response
    })
  }

  public stopCalibrationDistanceMeasuring(password: string) {
    this.socket.emit('settings:stop:calibration:measurement', (password), (response: string) => {
      return response
    })
  }

  public openSnackbar_success(message: string) {
    this.snackBar.open(message, 'OK', {duration: 5000, verticalPosition: "top"})
  }


  public beep() {
    let sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    sound.play();
  }

  public actualize_sound_on() {
    this.sound_on = localStorage.getItem('sound_on') != 'false'
  }
}




