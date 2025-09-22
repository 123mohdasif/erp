import React, { useState, useEffect, useMemo } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

// --- Helper Components ---

// Chart for Overall Attendance Breakdown (Pie Chart)
const AttendancePieChart = ({ data }) => {
    const chartData = useMemo(() => {
        const counts = data.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    const COLORS = {
        Present: '#22c55e', // Green-500
        Absent: '#ef4444',  // Red-500
        Late: '#f97316',    // Orange-500
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overall Attendance</CardTitle>
                <CardDescription>A summary of all attendance records.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Chart for Monthly Attendance Trends (Bar Chart)
const MonthlyBarChart = ({ data }) => {
    const chartData = useMemo(() => {
        const monthlyStats = data.reduce((acc, record) => {
            const month = format(new Date(record.date), 'MMM yyyy');
            if (!acc[month]) {
                acc[month] = { month, Present: 0, Absent: 0, Late: 0 };
            }
            if (record.status in acc[month]) {
                acc[month][record.status]++;
            }
            return acc;
        }, {});
        return Object.values(monthlyStats).reverse();
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Attendance patterns over recent months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Present" fill="#22c55e" stackId="a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Absent" fill="#ef4444" stackId="a" />
                        <Bar dataKey="Late" fill="#f97316" stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};


// View for Students
const StudentAttendanceView = ({ attendanceData }) => (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <AttendancePieChart data={attendanceData} />
            <MonthlyBarChart data={attendanceData} />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Attendance Log</CardTitle>
                <CardDescription>Your detailed attendance history.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceData.map((record, index) => (
                            <TableRow key={record.id || index}>
                                <TableCell>{format(new Date(record.date), 'PPP')}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                        record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                        'bg-orange-100 text-orange-800'
                                    }`}>
                                        {record.status}
                                    </span>
                                </TableCell>
                                <TableCell>{record.remarks || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);

// View for Teachers
const TeacherAttendanceView = ({ classList, onSubmit }) => {
    const [date, setDate] = useState(new Date());
    const [attendance, setAttendance] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initialAttendance = classList.reduce((acc, student) => {
            acc[student.id] = 'Present';
            return acc;
        }, {});
        setAttendance(initialAttendance);
    }, [classList]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };
    
    const handleLocalSubmit = async () => {
        setIsLoading(true);
        const attendancePayload = Object.entries(attendance).map(([student_id, status]) => ({
            student_id: parseInt(student_id),
            date: format(date, 'yyyy-MM-dd'),
            status,
            remarks: ''
        }));
        
        await onSubmit(attendancePayload);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Mark Class Attendance</CardTitle>
                    <CardDescription>Select a date and mark the attendance for each student.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classList.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                value={attendance[student.id] || 'Present'}
                                                onValueChange={(value) => handleStatusChange(student.id, value)}
                                                className="flex justify-center space-x-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Present" id={`p-${student.id}`} />
                                                    <Label htmlFor={`p-${student.id}`}>Present</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Absent" id={`a-${student.id}`} />
                                                    <Label htmlFor={`a-${student.id}`}>Absent</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Late" id={`l-${student.id}`} />
                                                    <Label htmlFor={`l-${student.id}`}>Late</Label>
                                                </div>
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Button onClick={handleLocalSubmit} disabled={isLoading} className="w-full">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        {isLoading ? 'Submitting...' : 'Submit Attendance'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};


// Main Attendance Page Component
export default function AttendancePage() {
    // --- ADDED LOGS FOR DEBUGGING ---
    console.log("--- Attendance Page Initializing ---");
    const userInfoString = localStorage.getItem('userInfo');
    console.log("1. Raw 'userInfo' from localStorage:", userInfoString);
    
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    console.log("2. Parsed 'userInfo' object:", userInfo);
    
    const token = localStorage.getItem('token');
    console.log("3. Token from localStorage:", token);
    
    // --- End of Logs ---

    const role = userInfo?.role;
    const userId = userInfo?.id; 
    const classId = userInfo?.class;

    const [attendanceData, setAttendanceData] = useState([]);
    const [classList, setClassList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !userInfo) {
                console.error("useEffect check failed: Token or userInfo is missing. Aborting API call.");
                setError("User information is missing. Please log in again.");
                setLoading(false);
                return;
            }
            
            console.log("4. Proceeding to fetch data with user:", userInfo);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            setError('');

            try {
                if (role === 'student') {
                    console.log(`Fetching student attendance for userId: ${userId}`);
                    const response = await axios.get(`/api/attendance/student/${userId}`, config);
                    setAttendanceData(response.data);
                } else if (role === 'teacher') {
                    console.log(`Fetching class list for classId: ${classId}`);
                    const response = await axios.get(`/api/attendance/class/${classId}`, config);
                    setClassList(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError(err.response?.data?.error || "An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [role, userId, classId, token, userInfo]); // Added token and userInfo to dependency array for clarity

    const handleSubmit = async (attendancePayload) => {
        if (!token) {
            setError("Cannot submit. User is not logged in.");
            return;
        }
        
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.post('/api/attendance/bulk', attendancePayload, config);
            alert('Attendance submitted successfully!');
        } catch (err) {
            console.error('Failed to submit attendance', err);
            setError(err.response?.data?.error || "Error submitting attendance.");
        }
    };

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h1>
            {role === 'student' ? (
                <StudentAttendanceView attendanceData={attendanceData} />
            ) : (
                <TeacherAttendanceView classList={classList} onSubmit={handleSubmit} />
            )}
        </div>
    );
}


