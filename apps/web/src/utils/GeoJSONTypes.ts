export type GeometryTypes = {
    type: string
    coordinates: number[][]
  }
  
  export type PropertiesTypes = {
    OBJECTID: string
    ADEQ_ID: string
    RIGHT_TYPE: string
    PCC: string
    CWS_NAME: string
    STATUS: string
    AMA: string
    OWNER_NAME: string
    COUNTY: string
    POPULATION: string
    ADDRESS: string
    CITY: string
    STATE: string
    ZIP_CODE: string
    PHONE: string
    CITY_SRVD: string
    Shape__Area: string
    Shape__Length: string
  }
  
  export type FeatureTypes = {
    type: string
    properties: PropertiesTypes
    geometry: GeometryTypes
  }