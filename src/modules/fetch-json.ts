interface IFetchOptions {
  url: string;
  body: {};
  method: string | undefined;
}

export default async (options: IFetchOptions) => {
  const raw = await fetch(options.url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.body),
  });
  return raw.json();
};
