
import React, { useState, useEffect } from 'react';
import { BoltIcon } from './icons';

export const SpeedTest: React.FC = () => {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState<{ download: number; upload: number; latency: number } | null>(null);
    const [animatedValues, setAnimatedValues] = useState({ download: 0, upload: 0, latency: 0 });

    const startTest = () => {
        setTesting(true);
        setResults(null);
        setAnimatedValues({ download: 0, upload: 0, latency: 0 });

        // Simulate test duration and generate final results
        setTimeout(() => {
            const finalResults = {
                download: Math.random() * 250 + 50, // 50-300 Mbps
                upload: Math.random() * 80 + 20, // 20-100 Mbps
                latency: Math.random() * 40 + 5, // 5-45 ms
            };
            setResults(finalResults);
            setTesting(false);
        }, 4000);
    };
    
    useEffect(() => {
        if (!testing && !results) return;

        let target = testing ? { download: 300, upload: 100, latency: 50 } : results;
        if (!target) return;

        const interval = setInterval(() => {
            setAnimatedValues(prev => ({
                download: testing ? Math.min(prev.download + Math.random() * 10, target!.download) : results!.download,
                upload: testing ? Math.min(prev.upload + Math.random() * 5, target!.upload) : results!.upload,
                latency: testing ? Math.max(prev.latency - Math.random() * 2, target!.latency) : results!.latency,
            }));
        }, 100);

        if (!testing) {
            clearInterval(interval);
            setAnimatedValues(results!);
        }

        return () => clearInterval(interval);
    }, [testing, results]);

    return (
        <div className="animate-slide-in text-center p-4">
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Network Speed Test</h2>
            <p className="text-neutral-600 mb-8">Check your current connection speed.</p>
            
            <div className="flex justify-center items-center mb-8">
                <button
                    onClick={startTest}
                    disabled={testing}
                    className="bg-primary text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-primary-dark transition-all duration-300 disabled:bg-neutral-400 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {testing ? 'Testing...' : 'Start Test'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-primary-light p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-primary mb-2">Download</h3>
                    <p className="text-4xl font-bold text-neutral-800">{animatedValues.download.toFixed(1)} <span className="text-2xl">Mbps</span></p>
                </div>
                <div className="bg-primary-light p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-primary mb-2">Upload</h3>
                    <p className="text-4xl font-bold text-neutral-800">{animatedValues.upload.toFixed(1)} <span className="text-2xl">Mbps</span></p>
                </div>
                <div className="bg-primary-light p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-primary mb-2">Latency</h3>
                    <p className="text-4xl font-bold text-neutral-800">{animatedValues.latency.toFixed(0)} <span className="text-2xl">ms</span></p>
                </div>
            </div>

            {results && !testing && (
                <div className="mt-8 bg-green-100 text-green-800 p-4 rounded-lg max-w-4xl mx-auto">
                    <strong>Test complete!</strong> Your results can help you choose a plan that meets your speed requirements.
                </div>
            )}
        </div>
    );
};
