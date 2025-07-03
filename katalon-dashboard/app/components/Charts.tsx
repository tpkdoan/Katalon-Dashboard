"use client";
import { useState, useEffect } from "react";

export function Charts() {
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        // Simulate chart data
        const generateData = () => {
            const data = [];
            for (let i = 0; i < 7; i++) {
                data.push(Math.floor(Math.random() * 100) + 20);
            }
            return data;
        };

        setChartData(generateData());
    }, []);

    const maxValue = Math.max(...chartData, 1);
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="w-full h-64">
            <div className="flex items-end justify-between h-48 space-x-2">
                {chartData.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="relative w-full">
                            <div
                                className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                                style={{
                                    height: `${(value / maxValue) * 100}%`,
                                    minHeight: '4px'
                                }}
                            />
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                                {value}
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {labels[index]}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
                <span>0</span>
                <span>{Math.round(maxValue / 2)}</span>
                <span>{maxValue}</span>
            </div>
        </div>
    );
}
