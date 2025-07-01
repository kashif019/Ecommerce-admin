import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";

const COLORS = ["#ff0000", "#00c851", "#33b5e5"];

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/api/contact/getaddproduct")
      .then((res) => {
        const data = res.data;
        const totalStockIn = data.reduce((acc, item) => acc + item.inStock, 0);
        const totalStockOut = data.reduce((acc, item) => acc + item.stockQuantity, 0);
        const totalSold = data.reduce((acc, item) => acc + (item.inStock - item.stockQuantity), 0);

        const chartData = [
          { name: "Stock In", value: totalStockIn },
          { name: "Stock Out", value: totalStockOut },
          { name: "Sold", value: totalSold },
        ];

        setStockData(chartData);
      })
      .catch((err) => console.error("Error fetching product data:", err));
  }, []);

  return (
    <Paper sx={{ p: 3, backgroundColor: "#1a1a1a", color: "white" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Inventory Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stockData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {stockData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default Dashboard;
