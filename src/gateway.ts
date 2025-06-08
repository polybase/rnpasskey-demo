import { SERVER_URL } from './constants'
import { HealthResponse } from './model'

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

// primitives

const send = async<T>(url: string, method: Method, headers: Record<string, string>,  body?: any): Promise<T> => {
  const sendUrl = `${SERVER_URL}/${url}`
  console.warn('About to send request to server')

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  }

  if (method !== 'GET' && body !== undefined) {
    fetchOptions.body = body
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
