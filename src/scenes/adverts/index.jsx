import React from 'react';
import { Box, useTheme, Switch, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from "../../components/Header"; 
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'; // Import Add User Icon
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

// Mock Data for Adverts
const mockDataAdverts = [
  { 
    id: 1, 
    banner: 'https://placehold.it/100x50', // Placeholder image
    username: 'John Doe', 
    startDate: '2024-09-15', 
    endDate: '2024-10-15',
    status: true,
  },
  { 
    id: 2, 
    banner: 'https://placehold.it/100x50',
    username: 'Jane Smith', 
    startDate: '2024-10-01', 
    endDate: '2024-10-31',
    status: false,
  },
  // Add more advert data...
];

const Adverts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columnsAdverts = [
    { 
      field: 'banner', 
      headerName: 'Banner', 
      flex: 1, 
      renderCell: (params) => (
        <img 
          src={params.row.banner} 
          alt="advert banner" 
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
      {/* Header */}
      <Header 
        title="Advert Overview" 
        subtitle="Manage your adverts" 
        breadcrumbs={[
          { label: 'Dashboard', link: '/' }, 
          { label: 'Adverts', link: '/adverts' },
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
              Create Ad Campaign
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

      {/* DataGrid */}
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={mockDataAdverts}
          columns={columnsAdverts}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Adverts; 