import { PasskeyCreateRequest } from 'react-native-passkey'

export interface HealthResponse {
  status: string | undefined
}

// Registration

export interface RegistrationStartResponse {
  publicKey: PasskeyCreateRequest
}

// Authentication

export interface AuthenticationStartResponse {

}

export interface AuthenticationFinishRequest {

}

export interface AuthenticationFinishResponse {

}