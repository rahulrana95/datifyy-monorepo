import React from "react";
import { useEffect, useState } from "react";
import apiService from "../service/apiService";
import waitService from "../service/waitListService";
import { format, formatDistanceToNow, parseISO, set } from "date-fns";
import { toZonedTime } from 'date-fns-tz';

import * as Tabs from '@radix-ui/react-tabs';
import './waitList.css';
import Loader from "../common/loader/Loader";

import { Checkbox } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";

function formatTimestamp(timestamp: string): string {
    const parsedDate = parseISO(timestamp);

    // Get the user's local timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert to user's local timezone
    const zonedDate = toZonedTime(parsedDate, userTimeZone);

    // Format for 12-hour clock with AM/PM
    const formattedTime = format(zonedDate, 'dd MMM yyyy, hh:mm:ss a \'hrs\'');

    return formattedTime;
}


const WaitList = () => {
    interface WaitlistData {
        counts: { [key: string]: number };
        data: { id: string; name: string; email: string; status: string; createdAt: string }[];
        totalCount: number;
    }

    const [data, setData] = useState<WaitlistData>({ counts: {}, data: [], totalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const handleDelete = (id: string) => {
        // Implement the delete logic here
        console.log('Deleting item with ID:', id);
    };

    const handleSendMail = (email: string) => {
        // Implement the logic to send mail
        console.log('Sending email to:', email);
    };


    const handleCheckboxChange = (id: string) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(id)) {
            newSelectedItems.delete(id);
        } else {
            newSelectedItems.add(id);
        }
        setSelectedItems(newSelectedItems);
    };


    const fetchData = async () => {
        setLoading(true);
        waitService.getWaitlistData().then((response) => {
            if (response.error) {
                console.error("Error fetching waitlist data:", response.error.message);
                setLoading(false);
                return;
            }
            setData({
                ...response.response,
                data: response.response.data.sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            });
            setLoading(false);
        }
        );
    }
    // Optionally, you can fetch data from an API or update the data
    useEffect(() => {
        setInterval(() => {
            fetchData();
        }, 10000)
    }, []);

    const renderCard = (title: string, value: number) => (
        <div className="p-4 bg-white shadow-lg rounded-md flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-2xl font-bold text-blue-500">{value}</p>
        </div>
    );

    const counts = data.counts ?? {};
    const waitlistData = data.data ?? [];

    const Table: React.FC<{ data: Array<{ id: string; name: string; email: string; status: string; createdAt: string }> }> = ({ data }) => {
        return (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Send Mail</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => (
                        <tr key={index}>
                            <td>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Checkbox.Root className="CheckboxRoot" checked={selectedItems.has(entry.id)} id="c1" onCheckedChange={() => handleCheckboxChange(entry.id)}>
                                        <Checkbox.Indicator className="CheckboxIndicator">
                                            <CheckIcon />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>

                                </div>
                            </td>
                            <td>{entry.name}</td>
                            <td>{entry.email}</td>
                            <td>{new Date(entry.createdAt).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleSendMail(entry.email)}>Send Mail</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(entry.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };


    return (
        <div className="p-6 space-y-6">
            {/* Metrics Cards */}
            <div className="waitlist-container">
                <div className="metrics-cards">
                    <CardRoot title="Total Count" value={data.totalCount} />
                    <CardRoot title="Last 3 Months" value={counts.last3Months} />
                    <CardRoot title="Last 6 Hrs" value={counts.last6Hrs} />
                    <CardRoot title="Last 7 Days" value={counts.last7Days} />
                    {loading && <Loader />}
                </div>

                <Tabs.Root className="tabs-root" defaultValue="last30Days">
                    <Tabs.List className="tabs-list">
                        <Tabs.Trigger className="tab-trigger" value="last30Days">Last 30 Days</Tabs.Trigger>
                        <Tabs.Trigger className="tab-trigger" value="last60Days">Last 60 Days</Tabs.Trigger>
                        <Tabs.Trigger className="tab-trigger" value="lastYear">Last Year</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content className="tabs-content" value="last30Days">
                        <Table data={waitlistData} />
                    </Tabs.Content>
                    <Tabs.Content className="tabs-content" value="last60Days">
                        <Table data={waitlistData} />
                    </Tabs.Content>
                    <Tabs.Content className="tabs-content" value="lastYear">
                        <Table data={waitlistData} />
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
};

const CardRoot: React.FC<{ title: string, value: number }> = ({ title, value }) => {
    return (
        <div className="card-root">
            <div className="card-header">{title}</div>
            <div className="card-content">
                <span className="card-value">{value}</span>
            </div>
        </div>
    );
};



export default WaitList;
