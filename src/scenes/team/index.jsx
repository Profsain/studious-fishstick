import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  Box, Chip, ButtonGroup, Avatar, Typography, Button, Grid, Menu, MenuItem, Link, InputBase, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import AuthContext from '../../context/AuthContext';
import ViewModal from './ViewModal';
import EditModal from './EditModal';
import AddModal from './AddModal'
import { teamViewFields } from './teamFields';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import Swal from 'sweetalert2';

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
      if (!response.ok) throw new Error('Network response was not ok');
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

  // Memoized filtered rows for performance
  const filteredRows = useMemo(() => {
    return adminData.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        row.firstName?.toLowerCase().includes(search) || // Optional chaining
        row.lastName?.toLowerCase().includes(search) ||  // Optional chaining
        row.phoneNumber?.toLowerCase().includes(search) || // Optional chaining
        row.emailAddress?.toLowerCase().includes(search) || // Optional chaining
        row.staffId?.toLowerCase().includes(search) // Optional chaining
      );
    });
  }, [adminData, searchText]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(row);
  };

  const handleClose = () => {
    setTimeout(() => {
      setAnchorEl(null);
    }, 100); 
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const handleEdit = (admin) => {
    setEditAdminData(admin);
    setOpenEditModal(true);
  };

  const handleDelete = async (admin) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f86a3b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      handleClose(); 
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
          Swal.fire('Deleted!', `${selectedAdmin.firstName} ${selectedAdmin.lastName} deleted successfully!`, 'success');
        } else {
          const errorData = await response.json();
          Swal.fire('Error!', errorData.message || 'Failed to delete the admin.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete the admin.', 'error');
      }
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      const response = await fetch(`${apiUrl}/admin/admin-update/${values._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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
        const errorData = await response.json(); // Parse error response from API
        throw new Error(errorData.message || 'Failed to create admin'); // Throw error with message
      }

      // Parse successful response
      const newAdmin = await response.json();

      // Update adminData with a new array reference 
      setAdminData(prevData => [...prevData, newAdmin]); 
      handleCloseAddModal();

      // Display SweetAlert for successful admin creation
      Swal.fire({
        title: `${formData.firstName} ${formData.lastName} has been added successfully!`,
        icon: 'success',
      });

    } catch (error) {
      console.error("Error creating admin:", error);
      // Handle the error (e.g., display an error message)
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to create admin',
        icon: 'error',
      });
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
      field: 'Name',
      headerName: 'Full Name',
      flex: 2,
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          onClick={() => handleView(params.row)} // Add onClick here
          sx={{ cursor: 'pointer' }} // Add cursor style for visual feedback 
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: '8px' }}>
            {`${params.row.firstName} ${params.row.lastName}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'staffId',
      headerName: 'Staff ID',
      width: 90,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Chip
            label={`${params.row.staffId}`}
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: colors.primary.contrastText,
            }}
          />
        </Box>
      ),
    },
    { field: "emailAddress", headerName: "Email Address", flex: 2, hide: isMobile },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1, hide: isMobile },
    { field: "city", headerName: "Location", flex: 1, hide: isMobile },
    { field: "role", headerName: "Role", flex: 1, hide: isMobile },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200, // Adjust width as needed
      renderCell: (params) => (
        <ButtonGroup
          variant="contained"
          disableElevation
          sx={{
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >          <Button
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: 'white',
            '&:hover': {
              backgroundColor: '#f86a3b',
            },
          }}
          onClick={() => handleView(params.row)}
          startIcon={<VisibilityIcon />} // Add the VisibilityIcon (eye)
        >
            View
          </Button>
          <Button
            sx={{
              backgroundColor: '#fa7c50',
              color: 'white',
              '&:hover': {
                backgroundColor: '#f86a3b',
              },
            }}
            onClick={(event) => handleClick(event, params.row)}
            endIcon={<ArrowDropDownIcon />}
          >
          </Button>
          {/* Dropdown Menu for Actions */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* Edit Menu Item */}
            <MenuItem onClick={() => {
              handleEdit(selectedAdmin);
              handleClose();
            }}>
              Edit
            </MenuItem>

            {/* Delete Menu Item with SweetAlert Confirmation */}
            <MenuItem
              onClick={() => {
                Swal.fire({
                  title: `Are you sure you want to delete ${selectedAdmin.firstName} ${selectedAdmin.lastName}?`,
                  text: 'This action cannot be undone.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: colors.greenAccent[500],
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete!'
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(selectedAdmin);
                    handleClose();
                  }
                });
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </ButtonGroup>
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
              placeholder="Search Team..."
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
                // onRowClick={(params) => {
                //   const clickedAdmin = params.row;
                //   handleView(clickedAdmin);
                // }}
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
          title="Edit Admin"  // Add the title prop here
        />
        {/* AddModal */}
        <AddModal
          open={openAddModal}
          onClose={handleCloseAddModal}
          fields={teamViewFields}
          onSubmit={handleSubmitNewAdmin}
          title="Create New Admin"
        />
      </Grid>
    </Box>
  );
};
export default TeamManager;