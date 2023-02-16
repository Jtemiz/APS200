import {Injectable} from '@angular/core';
import {io} from "socket.io-client";
import {BackendStatusInterface} from "../util/BackendStatus.interface";
import {MeasurementInterface, MeasurementMetadata} from "../util/Measurement.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  backendStatus: BackendStatusInterface = {
    MEASUREMENT_ACTIVE: false,
    PAUSE_ACTIVE: false,
    BATTERY_LEVEL: 0,
    MEASUREMENT_DISTANCE: 0,
    MEASUREMENT_VALUE: 0,
    LIMIT_VALUE: 0
  }

  public socket = io("192.168.178.57:5000", {transports: ['websocket']})

  constructor() {
    this.socket.on('connect', () => console.log("connected")
    )
    this.socket.on('status', (data) => {
      this.backendStatus = data['sps-status']
    })
  }

  getValue(key: string): any {
    return this.backendStatus[key as keyof BackendStatusInterface]
  }

  /**
   * Chart Actions
   */
  public start_measuring() {
    this.socket.emit('chart:start:measuring', (response: string) => {
      console.log(response)
    })
  }

  public stop_measuring() {
    this.socket.emit('chart:stop:measuring', (response: string) => {
      console.log(response)
    })
  }

  public toggle_pause() {
    this.socket.emit('chart:toggle:pause', (response: string) => {
      console.log(response)
    })
  }

  public add_comment() {
    this.socket.emit('chart:add:comment', (response: string) => {
      console.log(response)
    })
  }

  /**
   * Data Actions
   */
  public async get_measurement(tableName: string): Promise<MeasurementInterface> {
    let socket = this.socket
    return new Promise(function (resolve, reject) {
      socket.emit('data:get:measurement', (tableName), (response: MeasurementInterface) => {
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

  /**
   * Settings Actions
   */

  public async get_all_quick_com_buttons(): Promise<string[]> {
    let socket = this.socket
    return new Promise(function (resolve, reject) {

    })
  }

  public async add_quick_com_button(content: string): Promise<string> {
    let socket = this.socket
    return new Promise(function (resolve, reject) {
      socket.emit('settings:add:commentBtn', (content), (response: string) => {
        if (response == 'ok') {
          return resolve('ok')
        } else {
          return reject(new Error('error on adding new QuickComBtn'))
        }
      })
    })
  }
}

