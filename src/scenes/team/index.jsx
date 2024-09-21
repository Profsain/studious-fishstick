import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  Box, Avatar, Typography, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal, InputBase, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import AuthContext from '../../context/AuthContext';
import ViewModal from '../../components/ViewModal';
import EditModal from '../../components/EditModal';
import { teamViewFields } from './teamFields';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const TeamManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);

  const [adminData, setAdminData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/admin-get-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAdminData(data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editAdminData, setEditAdminData] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Memoize filteredRows for performance
  const filteredRows = useMemo(() => {
    return adminData.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        row.firstName.toLowerCase().includes(search) ||
        row.lastName.toLowerCase().includes(search) ||
        row.phoneNumber.toLowerCase().includes(search) ||
        row.emailAddress.toLowerCase().includes(search) ||
        row.staffId.toLowerCase().includes(search)
      );
    });
  }, [adminData, searchText]);

  const handleClick = (event, row) => { // Update handleClick to accept row data
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(row); // Set the selected admin when clicking the dropdown
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditAdminData(admin);
    setOpenEditModal(true);
  };

  const handleDelete = (admin) => {
    console.log("Deleted Admin", admin)
  }

  const handleEditSubmit = async (values) => {
    console.log('Updating admin with values:', values);

    try {
      // 1. Make API call to update the admin data
      const response = await fetch(`${apiUrl}/admin/admin-update/${values._id}`, {
        method: 'PUT', // Or PATCH, depending on your API
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 2. Update the adminData state (after successful API call)
      const updatedAdminData = await response.json();
      setAdminData(prevData =>
        prevData.map(admin => (admin._id === updatedAdminData._id ? updatedAdminData : admin))
      );

      setOpenEditModal(false);
    } catch (error) {
      console.error('Error updating admin:', error);
      // Handle error (display error message, etc.)
    }
  };

  const columns = [
    {
      field: 'profileImage', // Add the image field
      headerName: 'Profile',
      width: 80,
      renderCell: (params) => (
        <Avatar alt={params.row.firstName} src={params.row.profileImage} /> // Display the image in the Avatar
      ),
    },
    { field: "staffId", headerName: "Staff ID", width: 130 },
    { field: "firstName", headerName: "Firstname", flex: 1 },
    { field: "lastName", headerName: "Surname", flex: 1 },
    { field: "emailAddress", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "city", headerName: "Location", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between">
          <IconButton
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: "white",
              "&:hover": { backgroundColor: "#f86a3b" },
            }}
            onClick={() => handleView(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "#fa7c50",
              color: "white",
              "&:hover": { backgroundColor: "#f86a3b" },
            }}
            onClick={(event) => handleClick(event, params.row)}
          >
            <ArrowDropDownIcon />
          </IconButton>
          {/* Menu should be outside the ButtonGroup */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)} // Open menu when anchorEl is set
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleEdit(selectedAdmin); handleClose(); }}>Edit</MenuItem>
            <MenuItem onClick={() => { handleDelete(selectedAdmin); handleClose(); }}>Delete</MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
            <Link to="/" style={{ textDecoration: 'none', color: colors.grey[100] }}>
              Home
            </Link>{' '}
            / Team
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Team Management
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            Add, view, edit, and manage your team members
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={1} justifyContent={isMobile ? "flex-start" : "flex-end"}>
          <Grid item>
            <InputBase
              sx={{
                mr: 2, flex: 3,
                border: '1px solid white',
                borderRadius: '4px',
                marginBottom: '10px',
                padding: '10px 14px',
                '& .MuiInputBase-input': {
                  color: 'white',
                }
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Events..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            <Button
              sx={{
                backgroundColor: colors.greenAccent[600],
                color: colors.grey[100],
                fontSize: "16px",
                fontWeight: "600",
                padding: "10px 20px",
                marginRight: isMobile ? "0" : "0px",
                marginBottom: isMobile ? "10px" : "0",
                '&:hover': {
                  backgroundColor: colors.greenAccent[600], // Darker green on hover
                },
              }}
            >
              <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
              Add Team
            </Button>
          </Grid>

        </Grid>
        {/* DataGrid Section */}
        <Grid item xs={12}>
          <Box
            m="0px 0 0 0"
            height={isMobile ? "75vh" : "100vh"}
            sx={{
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .name-column--cell": { color: colors.greenAccent[300] },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            {isLoading ? (
              <Typography variant="h5" align="center" color="textSecondary">
                Loading data...
              </Typography>
            ) : (
              <DataGrid
                checkboxSelection
                hideFooterSelectedRowCount
                rows={filteredRows}
                getRowId={(row) => row._id}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            )}
          </Box>
        </Grid>

        {/* ViewModal */}
        <ViewModal
          open={openViewModal}
          onClose={handleCloseModal}
          recordData={selectedAdmin}
          fields={teamViewFields}
        />

        {/* EditModal */}
        <EditModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          initialValues={editAdminData}
          onSubmit={handleEditSubmit}
          fields={teamViewFields}
        />

        {/* ConfirmationDialog (You'll need to implement this from your Prof's code) */}
        {/* <ConfirmationDialog 
          // ... props for the ConfirmationDialog 
        /> */}
      </Grid>
    </Box>
  );
};

export default TeamManager;