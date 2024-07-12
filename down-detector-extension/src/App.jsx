import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [site, setSite] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3333/${site}`);
            setData(response.data);
        } catch (err) {
            setError('Unable to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-w-40 p-4">
            <h1 className="text-2xl font-bold mb-4">Website Down Detector</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Enter website name (e.g., github.com)"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Check Status
                </button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {data && (
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2">Results</h2>
                    <p>Logo: {data.logo}</p>
                    <p>
                        URL:{' '}
                        <a
                            href={data.url}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {data.url}
                        </a>
                    </p>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Problems</h3>
                        <ul className="list-disc list-inside mt-2">
                            <li>App: {data.problems.app}%</li>
                            <li>Website: {data.problems.website}%</li>
                            <li>Server: {data.problems.server}%</li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Comments</h3>
                        <ul className="list-disc list-inside mt-2">
                            {Object.keys(data.comments).map((key) => (
                                <li key={key} className="mt-2">
                                    <strong>{data.comments[key].user}</strong> ({data.comments[key].date}): {data.comments[key].comment}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Chart</h3>
                        {/* Display chart or other data as needed */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
