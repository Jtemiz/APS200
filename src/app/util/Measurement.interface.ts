export interface MeasurementInterface {
  metaData: MeasurementMetadata
  measurementValues: MeasurementValue[]
}

export interface MeasurementValue {
  position: number
  height: number
  speed: number
  streetWidth: number
  limitValue: number
}

export interface MeasurementMetadata {
  id: string
  name: string
  date: Date
  location: string
  distance: number
  user: string
  description: string
}
