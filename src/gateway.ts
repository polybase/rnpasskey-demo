import { PasskeyCreateRequest, PasskeyCreateResult } from 'react-native-passkey'
import { SERVER_URL } from './constants'
import { AuthenticationFinishRequest, AuthenticationFinishResponse, AuthenticationStartRequest, AuthenticationStartResponse, HealthResponse, RegistrationRequest } from './model'

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

const send = async<T>(url: string, method: Method, headers: Record<string, string>,  body?: any): Promise<T> => {
  const sendUrl = `${SERVER_URL}/${url}`
  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  }

  if (method !== 'GET' && body !== undefined) {
    fetchOptions.body = JSON.stringify(body)
  }

  const res = await fetch(sendUrl, fetchOptions)

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${method}/${res.status}: ${err}`)
  }

  return res.json()
}

const get = async<T>(url: string, body?: any): Promise<T> => {
  return send(url, 'GET', {}, body)
}

const post = async <T>(url: string, body: any): Promise<T> => {
  return send(url, 'POST', {}, body)
}

export const getServerHealth = async (): Promise<HealthResponse> => {
  return get<HealthResponse>('health')
}

export const startRegistration = async (req: RegistrationRequest): Promise<PasskeyCreateRequest> => {
  return post<PasskeyCreateRequest>('registration/start', req)
}

export const finishRegistration = async (req: PasskeyCreateResult): Promise<void> => {
  return post<void>('registration/finish', req)
}

export const startAuthentication = async (req: AuthenticationStartRequest): Promise<AuthenticationStartResponse> => {
  return post<AuthenticationStartResponse>('authentication/start', req)
}

export const finishAuthentication = async (req: AuthenticationFinishRequest): Promise<AuthenticationFinishResponse> => {
  return post<AuthenticationFinishResponse>('authentication/finish', req)
}
