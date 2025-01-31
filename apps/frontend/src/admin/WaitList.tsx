import React from "react";
import { useEffect, useState } from "react";
import apiService from "../service/apiService";
import waitService from "../service/waitListService";
import { format, formatDistanceToNow, parseISO, set } from "date-fns";
import { toZonedTime } from 'date-fns-tz';

import * as Tabs from '@radix-ui/react-tabs';
import './waitList.css';
import Loader from "../common/loader/Loader";
import { Slot } from "@radix-ui/react-slot";

import { Checkbox } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";

function convertUnixToLocalTime(unixTimestamp: number): string {
    // Convert Unix timestamp to milliseconds
    const date = new Date(unixTimestamp);

    // Format date and time in the local timezone
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',   // "Monday"
        year: 'numeric',   // "2025"
        month: 'long',     // "January"
        day: 'numeric',    // "30"
        hour: '2-digit',   // "02"
        minute: '2-digit', // "45"
        second: '2-digit', // "30"
        hour12: true,      // Use 12-hour format (AM/PM)
    };

    return date.toLocaleString('en-US', options);
}


const WaitList = () => {
    interface WaitlistData {
        counts: { [key: string]: number };
        data: { id: string; name: string; email: string; status: string; createdAt: string }[];
        totalCount: number;
    }

    const [data, setData] = useState<WaitlistData>({ counts: {}, data: [], totalCount: 0 });
    const [loading, setLoading] = useState(true);
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
                data: response.response.data.sort((a: { createdAt: string }, b: { createdAt: string }) => Number(b.createdAt) - Number(a.createdAt))
            });
            setLoading(false);
        }
        );
    }
    // Optionally, you can fetch data from an API or update the data
    useEffect(() => {
        setInterval(() => {
            fetchData();
        }, 5000);
    }, []);

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
                            <td>{convertUnixToLocalTime(Number(entry.createdAt))}</td>
                            <td>
                                <Slot>
                                    <button className="send-mail-button" onClick={() => handleSendMail(entry.email)}>
                                        Send Mail
                                    </button>
                                </Slot>
                            </td>
                            <td>
                                <Slot>
                                    <button className="send-mail-button" onClick={() => handleDelete(entry.id)}>
                                        Delete
                                    </button>
                                </Slot>
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
                    <CardRoot title="Last 24 hrs" value={counts.last24Hrs} />
                    <CardRoot title="Last 7 days" value={counts.last7Days} />
                    <CardRoot title="Last 30 days" value={counts.last30Days} />
                    <CardRoot title="Last 60 days" value={counts.last60Days} />
                    <CardRoot title="Last 3 months" value={counts.last3Months} />
                    <CardRoot title="Last 6 months" value={counts.last6Months} />
                    <CardRoot title="Last 1 year" value={counts.lastYear} />
                    {loading && <Loader text="Fetching latest content" />}
                </div>

                <Tabs.Root className="tabs-root" defaultValue="last30Days">


                    <Tabs.Content className="tabs-content" value="last30Days">
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
