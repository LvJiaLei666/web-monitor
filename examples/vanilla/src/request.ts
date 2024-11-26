type RequestOptions = {
  url: string
  method?: string
  headers?: Record<string, string>
  data?: Record<string, string>
}

// type response = {}

export default function request(options?: RequestOptions): Promise<any> {
  const { url = '', method = 'GET', headers = {} } = options || {}
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key])
    })
    xhr.send()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(xhr.response)
        }
      }
    }
  })
}
