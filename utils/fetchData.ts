// This function is used to fetch data from a server using the Fetch API.
interface Config {
  method: string;
  headers: {
    'Content-Type'?: string;
    Authorization?: string;
  };
  body?: FormData | string | undefined | any;
  signal?: AbortSignal;
  parsedData?: boolean;
}

export const fetchData = async (
  server: string,
  endpoint: string,
  method: string = 'get',
  body: object = {},
  query: object = {},
  optionalHeaders: object = {},
  isMultipart: boolean = false,
  isStreaming: boolean = false,
  signal?: AbortSignal,
  parsedData: boolean = true,
) => {
  let authToken = '';
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
    authToken = token || '';
  }
  let queryString = '';
  if (Object.keys(query).length > 0) {
    queryString = '?' + new URLSearchParams(query as Record<string, string>).toString();
  }

  const targetURL = server + endpoint + queryString;
  let config: Config = {
    method, 
    headers: {
      Authorization: `Bearer `,
    },
    body: undefined
  };

  if (signal) {
    config.signal = signal;
  }

  if (isMultipart) {
    config = {
      ...config,
      headers: {
        ...config.headers,
      },
    };
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  if (Object.keys(optionalHeaders).length > 0) {
    let newHeaders = Object.assign({}, optionalHeaders);
    config.headers = {
      ...config.headers,
      ...newHeaders
    };
  }

  if ((method === 'post' || method === 'put' || method === 'delete') && isMultipart === false) {
    config.body = JSON.stringify(body);
  } else if ((method === 'post' || method === 'put') && isMultipart === true) {
    config.body = body;
  }

  if(config.headers.Authorization === 'Bearer Bearer') {
    delete config.headers.Authorization;
  }

  const response = await fetch(targetURL, config);
  if (response.status === 404) {
    console.error('404 : API not found');
  }

  // Return raw response if streaming is requested
  if (isStreaming) {
    return response;
  }

  // Otherwise process as JSON as before
  try {
    const data = parsedData ? await response.json() : response;
    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.log('Request was aborted');
    }
    console.error(err);
    throw err instanceof Error 
      ? err 
      : new Error("Error processing response");
  }
};
