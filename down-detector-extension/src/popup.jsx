import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('');

    const checkWebsiteStatus = async () => {
        if (!url.startsWith('http')) {
            setStatus('Please enter a valid URL including http or https');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/check?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'online') {
                setStatus('Website is online');
            } else {
                setStatus('Website is offline');
            }
        } catch (error) {
            console.error('Error checking website status:', error);
            setStatus('Website is offline');
        }
    };

    return (
        <div>
            <h1>Check Website</h1>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL"
            />
            <button onClick={checkWebsiteStatus}>Check</button>
            <p>{status}</p>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<Popup />);
