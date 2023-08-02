import React, { useState } from 'react';

interface CreateShortUrlRequest {
  original_url: string;
  user_id: number;
}

interface CreateShortUrlResponse {
  original_url: string;
  short_url: string;
}

const Urls: React.FC = () => {
  const [formData, setFormData] = useState<CreateShortUrlRequest>({
    original_url: '',
    user_id: 1, // hardcoded user
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/urls', {
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

  return (
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
  );
};

export default Urls;
