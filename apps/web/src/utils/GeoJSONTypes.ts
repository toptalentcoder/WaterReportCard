export type GeometryTypes = {
    type: string
    coordinates: number[][]
  }
  
  export type PropertiesTypes = {
    Boundary_Method: string;
    Data_Provider_Type: string;
    Data_Source_Link: string;
    Detailed_Facility_Report: string;
    Method_Basis: string;
    Method_Details: string;
    Original_Data_Provider: string;
  
    PWSID: string;
    PWS_Name: string;
    Pop_Cat_5: string;
    Population_Served_Count: number;
    Primacy_Agency: string;
    Secondary_ID: string;
    Secondary_ID_Source: string;
    Service_Area_Type: string;
    Service_Connections_Count: number;
    Shape_Area: number;
    Shape_Length: number;
    State: string;
    Symbology_Field: string;
    System_Type: string;
    Verification_Process: string;
    Verification_Status: string;
    Verifier_Type: string;
  };
  
  
  export type FeatureTypes = {
    type: string
    properties: PropertiesTypes
    geometry: GeometryTypes
  }