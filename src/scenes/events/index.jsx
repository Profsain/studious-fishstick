import React from 'react';
import { Box, useTheme, Switch, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from "../../components/Header"; 
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'; 
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

// Mock Data for Events
const mockDataEvents = [
  { 
    id: 1, 
    banner: 'https://placehold.it/100x50', 
    username: 'Alice Johnson', 
    startDate: '2024-10-28', 
    endDate: '2024-10-29',
    status: true,
  },
  { 
    id: 2, 
    banner: 'https://placehold.it/100x50', 
    username: 'Bob Williams', 
    startDate: '2024-11-10', 
    endDate: '2024-11-12',
    status: true,
  },
  // Add more event data...
];

const Events = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columnsEvents = [
    { 
      field: 'banner', 
      headerName: 'Banner', 
      flex: 1, 
      renderCell: (params) => (
        <img 
          src={params.row.banner} 
          alt="event banner" 
          style={{ width: '100px', height: '50px', objectFit: 'cover' }} 
        />
      ) 
    },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'endDate', headerName: 'End Date', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Switch 
          checked={params.row.status} 
          // onChange={() => handleStatusChange(params.row)} 
        />
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header 
        title="Events Overview" 
        subtitle="Manage your events" 
        breadcrumbs={[
          { label: 'Dashboard', link: '/' }, 
          { label: 'Events', link: '/events' },
        ]} 
        sideButtons={
          <Box display="flex">
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                marginRight: "15px", 
              }}
            >
              <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
              Create New Event
            </Button>
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Export
            </Button>
          </Box>
        }
      />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={mockDataEvents} columns={columnsEvents} />
      </Box>
    </Box>
  );
};

export default Events; 