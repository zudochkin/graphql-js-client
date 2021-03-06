export default function httpFetcher(url, options = {}) {
  return function fetcher(graphQLParams, headers) {
    return fetch(url, {
      body: JSON.stringify(graphQLParams),
      method: 'POST',
      mode: 'cors',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
        ...headers
      }
    }).then((response) => {
      const contentType = response.headers.get('content-type');

      if (contentType.includes('application/json')) {
        return response.json();
      }

      return response.text().then((text) => ({text}));
    });
  };
}
