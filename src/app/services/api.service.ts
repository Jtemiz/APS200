import {Injectable} from '@angular/core';
import {io} from "socket.io-client";
import {BackendStatusInterface} from "../util/BackendStatus.interface";
import {MeasurementInterface, MeasurementMetadata, MeasurementValue} from "../util/Measurement.interface";
import {publish, timestamp} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {PrimitiveTypes} from "@angular/cli/src/analytics/analytics-parameters";

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
  }

  measurementValues: MeasurementValue[] = []

  public socket;

  constructor() {
    this.socket = io("127.0.0.1:5000", {transports: ['websocket']})
    this.socket.on('connect', () => console.log("connected")
    )
    this.socket.on('status', (data) => {
      this.statusValue = data
    })
    this.socket.on('value', (data) => {
      for (let i = 0; i < data.length; i++) {
        this.measurementValues.push(data[i])
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
      console.log(response)
    })
  }

  public stop_measuring() {
    this.socket.emit('chart:stop:measuring', (response: string) => {
      console.log(response)
    })
  }

  public start_pause() {
    this.socket.emit('chart:start:pause', (response: string) => {
      console.log(response)
    })
  }

  public stop_pause() {
    this.socket.emit('chart:stop:pause', (response: string) => {
      console.log(response)
    })
  }

  public add_comment(comment: string) {
    this.socket.emit('chart:add:comment', ({comment: comment}), (response: string) => {
      console.log(response)
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
      console.log(response)
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
      console.log(response)
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
      console.log(response)
    })
  }

  public update_metadata(tableName: string, name: string, user: string, location: string, notes: string) {
    this.socket.emit('data:set:metadata', ({tableName: tableName, metaData: {name: name, user: user, location: location, notes: notes}}), (response: string) => {
      console.log(response)
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
      if (response === 'error') {
        // todo generate toastr
      }
    })
  }

  public delete_quick_com_button(content: string) {
    this.socket.emit('settings:delete:commentBtn', (content), (response: string) => {
      if (response === 'error') {
        // todo generate toastr
      }
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


  public setCalibrationStep(step: number, password:string) {
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
}

