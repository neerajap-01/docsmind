import url from 'url';

interface Config {
  method: string;
  headers: {
    'Content-Type'?: string;
    // Authorization: string;
    credentials: string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Methods': string;
    'Access-Control-Allow-Credentials': string;
  };
  body?: FormData | string | undefined | any;
}

export const fetchData = async (
  server: string,
  endpoint: string,
  method: string = 'get',
  body: object = {},
  query: object = {},
  optionalHeaders: object = {},
  isMultipart: boolean = false,
  isStreaming: boolean = false
) => {
  // let token =
  //   'eyJraWQiOiJyY1FhVjJZZW5PVFMyTVNiMmNwMW5HTERtOVJwV0o4ekhSbklFWEg1MHE0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZmJhZjNiMS0wOTg2LTRiOWItYWU3ZS1kYWMwOTZjMTMxZmYiLCJjb2duaXRvOmdyb3VwcyI6WyJhcC1zb3V0aC0xXzU1dllWYUJpMF9Hb29nbGUiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV81NXZZVmFCaTAiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI2dTg4cTdjazh2ampnbWx0YzJhcW1wcWRmZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gcGhvbmUgb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE3MzIyNTg0OTQsImV4cCI6MTczMjc5MTEyNCwiaWF0IjoxNzMyNzg3NTI0LCJqdGkiOiJiYjg0ZTdjOC0zMGI1LTQ4MDYtOGQ5Yy1mMjBjOGUzYTVhZGQiLCJ1c2VybmFtZSI6Ikdvb2dsZV8xMTU3NDUyMjk1ODg0NTQ4MTA0MDcifQ.F7FDZ35xCtQdSip3u-w3UkelGGDUh2uvbuKliDvUev7EDu6XRPJ_agzjWFhTAmyfEWNAdYy_NfdXYVUeyLwGiOzMqfE3kZc1d_vdTvZTbvK_1j-ZYI9bdccbsuk8I7YcPRUcWoM7H44YIIqXPWJpYSEVCMbUt1jUp5yRIG1GdjLF5kmIiqXv65HMGBYpm-f019SbpoImAj4asMZXsqpBxKJ3vWAsvDCAgJ9ysHKdYmmTElamxiuP94WBAKuPN3vsg63OZUZxqO1U5wO4ZwGnHVZBJlMNh0emo8tP-Xz0KIVMFBtHt2MirI7CFLGisSUR8ykKZUxSUbhGAFTMr5VqAQ';
  // const authToken =
  //   // eslint-disable-next-line no-undef
  //   process.env.APP_ENV === 'local' ? token : await Bifrost.getAccessToken();
  let queryString = '';
  if (Object.keys(query).length > 0) {
    queryString = '?' + new URLSearchParams(query as Record<string, string>).toString();
  }

  const targetURL = server + endpoint + queryString;
  let config: Config = {
    method, 
    headers: {
      // Authorization: `Bearer ${authToken}`,
      credentials: 'omit',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: undefined
  };
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
  console.log("targetURL: ", targetURL);
  console.log("config: ", config);
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
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
