export interface MeasurementInterface {
  metaData: MeasurementMetadata
  measurementValues: MeasurementValue[]
}

export interface MeasurementValue {
  index: number
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
  place: string
  distance: number
  user: string
  description: string
}
