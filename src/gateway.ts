import { PasskeyCreateRequest, PasskeyCreateResult, PasskeyGetResult } from 'react-native-passkey'
import { SERVER_URL } from './constants'
import { AuthenticationStartResponse, HealthResponse, RegistrationStartResponse } from './model'

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

const post = async <T>(url: string, body?: any): Promise<T> => {
  return send(url, 'POST', {}, body)
}

export const getServerHealth = async (): Promise<HealthResponse> => {
  return get<HealthResponse>('health')
}

export const startRegistration = async (username: string): Promise<RegistrationStartResponse> => {
  return post<RegistrationStartResponse>(`registration/start/${username}`)
}

export const finishRegistration = async (username: string, req: PasskeyCreateResult): Promise<void> => {
  return post<void>(`registration/finish/${username}`, req)
}

export const startAuthentication = async (username: string): Promise<AuthenticationStartResponse> => {
  return post<AuthenticationStartResponse>(`authentication/start/${username}`)
}

export const finishAuthentication = async (username: string, req: PasskeyGetResult): Promise<void> => {
  return post<void>(`authentication/finish/${username}`, req)
}
