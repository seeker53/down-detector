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
            const response = await fetch(url, { mode: 'no-cors' });
            if (response.ok || response.type === 'opaque') {
                setStatus('Website is online');
            } else {
                setStatus('Website is offline');
            }
        } catch (error) {
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
