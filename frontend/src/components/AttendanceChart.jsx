import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from "recharts";
import { getAttendance, getAttendancePercentage } from "../api/attendanceApi";

const AttendanceChart = ({ studentId, token }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAttendance(studentId, token);
        // Transform data for chart: count present/absent per month
        const chartData = data.map((record) => ({
          month: new Date(record.date).toLocaleString("default", { month: "short" }),
          present: record.status === "present" ? 1 : 0,
        }));

        // Aggregate per month
        const monthlyData = [];
        chartData.forEach((item) => {
          const existing = monthlyData.find((m) => m.month === item.month);
          if (existing) existing.present += item.present;
          else monthlyData.push({ month: item.month, present: item.present });
        });

        setAttendanceData(monthlyData);

        const percentData = await getAttendancePercentage(studentId, token);
        setPercentage(percentData.attendance_percentage);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchData();
  }, [studentId, token]);

  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "20px auto" }}>
      <h2>Attendance Chart</h2>
      <p>Attendance Percentage: {percentage}%</p>
      <BarChart width={550} height={300} data={attendanceData}>
        <CartesianGrid vertical={false} stroke="#e0e0e0" />
        <XAxis dataKey="month" />
        <Tooltip />
        <Bar dataKey="present" fill="#4f46e5" radius={[8, 8, 0, 0]} />
      </BarChart>
    </div>
  );
};

export default AttendanceChart;
