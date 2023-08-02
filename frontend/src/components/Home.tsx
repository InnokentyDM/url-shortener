import React, { useState, useEffect } from 'react';

interface CreateShortUrlRequest {
  original_url: string;
  user_id: number;
}

interface CreateShortUrlResponse {
  original_url: string;
  short_url: string;
}

interface UrlData {
  id: number;
  original_url: string;
  short_url: string;
  count: number;
}

const Urls: React.FC = () => {
  const [formData, setFormData] = useState<CreateShortUrlRequest>({
    original_url: '',
    user_id: 1, // Hardcoded user id
  });
  const [submittedData, setSubmittedData] = useState<UrlData[]>([]);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/urls');
      if (!response.ok) {
        console.error('Error fetching URLs:', response.status, response.statusText);
        return;
      }
      const data: UrlData[] = await response.json();
      setSubmittedData(data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error('Error creating short URL:', response.status, response.statusText);
        return;
      }

      const data: CreateShortUrlResponse = await response.json();
      console.log('Short URL created:', data.short_url);

      setFormData({ original_url: '', user_id: formData.user_id });

      fetchUrls();
    } catch (error) {
      console.error('Error creating short URL:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const openShortUrl = (shortUrl: string) => {
    window.open(shortUrl, '_blank');
    fetchUrls();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="original_url">Original URL:</label>
        <input
          type="text"
          id="original_url"
          name="original_url"
          value={formData.original_url}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Short URL</button>
      </form>
      {submittedData.length > 0 && (
        <div>
          <h2>Previously Created URLs:</h2>
          <ul className="list-group">
            {submittedData.map((url) => (
              <li className="list-group-item" key={url.id}>
                <p>ID: {url.id}</p>
                <p>Original URL: {url.original_url}</p>
                <p>
                  Short URL:{' '}
                  <a href="#" onClick={() => openShortUrl(url.short_url)}>
                    {url.short_url}
                  </a>
                </p>
                <p>Count: {url.count}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Urls;
