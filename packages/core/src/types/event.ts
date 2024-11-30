export enum EVENTTYPES {
  ERROR = 'error',
  PERFORMANCE = 'performance',
  BEHAVIOR = 'behavior',
}

export enum ERROR_TYPES {
  JS_ERROR = 'js_error',
  PROMISE_ERROR = 'promise_error',
  RESOURCE_ERROR = 'resource_error',
  HTTP_ERROR = 'http_error',
  UNKNOWN_ERROR = 'unknown_error',
}

export interface EventBase {
  type: string
  timestamp: number
  pageUrl: string
  pageTitle: string
}

export interface ErrorEventData extends EventBase {
  type: ERROR_TYPES
  message?: string
  stack?: string
  filename?: string
  lineno?: number
  colno?: number
  tagName?: string
  url?: string
  status?: number
  response?: string
  method?: string
}
