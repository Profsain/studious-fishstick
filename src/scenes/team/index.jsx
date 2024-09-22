import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  Box, Chip, Avatar, Typography, Button, Grid, Menu, MenuItem, Link, InputBase, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import AuthContext from '../../context/AuthContext';
import ViewModal from '../../components/Modals/ViewModal';
import EditModal from '../../components/Modals/EditModal';
import { teamViewFields } from './teamFields';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ConfirmationDialog from './ConfirmationDialog';
import AddModal from '../../components/Modals/AddModal'; // Update the import path




const TeamManager = () => {
  // Fetch admin data from the server
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

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
  // Delete an admin (using ConfirmationDialog)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const handleDelete = async (admin) => {
    try {
      const response = await fetch(`${apiUrl}/admin/admin-delete/${admin._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAdminData(prevData => prevData.filter(item => item._id !== admin._id));
        alert('Success', 'Admin deleted successfully!');
      } else {
        const errorData = await response.json();
        alert('Error', errorData.message || 'Failed to delete the admin.');
      }
    } catch (error) {
      alert('Error', 'Failed to delete the admin.');
    }
  };

  // Combine handleDelete and confirmDelete into a single function 
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/admin-delete/${adminToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAdminData(prevData => prevData.filter(item => item._id !== adminToDelete._id));
        alert('Success', 'Admin deleted successfully!');
      } else {
        const errorData = await response.json();
        alert('Error', errorData.message || 'Failed to delete the admin.');
      }
    } catch (error) {
      alert('Error', 'Failed to delete the admin.');
    } finally {
      setOpenConfirmDialog(false);
      setAdminToDelete(null);
    }
  };

  const handleDelete = (admin) => {
    console.log("Deleted Admin", admin)
  }

  const handleEditSubmit = async (values) => {
    console.log('Updating admin with values:', values);

    try {
      const response = await fetch(`${apiUrl}/admin/admin-update/${values._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedAdminData = await response.json();
      setAdminData(prevData =>
        prevData.map(admin => (admin._id === updatedAdminData._id ? updatedAdminData : admin))
      );

      setOpenEditModal(false);
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleSubmitNewAdmin = async (formData) => {
    try {
      const response = await fetch(`${apiUrl}/admin/admin-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      const newAdmin = await response.json();
      setAdminData(prevData => [...prevData, newAdmin]); // Update adminData
      handleCloseAddModal();
    } catch (error) {
      console.error("Error creating admin:", error);
      // Handle error (e.g., display an error message)
    }
  };

  const columns = [
    {
      field: 'profileImage',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params) => (
        <Avatar alt={params.row.firstName} src={params.row.profileImage} />
      ),
    },
    {
      field: 'nameAndId', // Combine name and staffId
      headerName: 'Full Name - Staff ID',
      flex: 2,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: '8px', }}>
            {`${params.row.firstName} ${params.row.lastName}`}
          </Typography>
          <Chip
            label={`${params.row.staffId}`}
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: colors.primary.contrastText,
              padding: '41px 8px',
            }}
          />
        </Box>
      ),
    },
    { field: "emailAddress", headerName: "Email", flex: 2 },
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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
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
            {/* Add Team Button */}
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
                  backgroundColor: colors.greenAccent[600],
                },
              }}
              onClick={handleOpenAddModal}
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
                onRowClick={(params) => {
                  const clickedAdmin = params.row;
                  handleView(clickedAdmin);
                }}
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
        {/* AddModal */}
        <AddModal
          open={openAddModal}
          onClose={handleCloseAddModal}
          fields={teamViewFields}
          onSubmit={handleSubmitNewAdmin}
          title="Create New Admin"
        />
        {/* ConfirmationDialog */}
        <ConfirmationDialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          onConfirm={handleConfirmDelete}  // Use handleConfirmDelete here
          admin={adminToDelete}
        />
      </Grid>
    </Box>
  );
};

export default TeamManager;