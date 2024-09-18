import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { customerData } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const CustomerManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');

  const filteredRows = customerData.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase()) ||
    row.email.toLowerCase().includes(searchText.toLowerCase()) ||
    row.userId.toString().toLowerCase().includes(searchText.toLowerCase()) // Search by userId as string
  );

  // Modal style (same as in TeamManager)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const columns = [
    { field: 'userId', headerName: 'User ID', width: 100 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'plan', headerName: 'Plan', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <ButtonGroup variant="contained">
          <Button
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: 'white',
              '&:hover': {
                backgroundColor: '#f86a3b',
              },
            }}
            onClick={() => handleView(params.row)}
            startIcon={<VisibilityIcon />}
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
            onClick={(event) => handleClick(event, params.id)}
            endIcon={<ArrowDropDownIcon />}
          >

          </Button>
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
            / Customers
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Customer Management
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            View and manage your customers.
          </Typography>
        </Grid>

        <Grid item xs={12} container spacing={1} justifyContent={isMobile ? "flex-start" : "flex-end"}>
          <Grid item>
            <TextField
              variant="outlined"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                mb: 2,
                width: isMobile ? "100%" : "200px",
                mr: 2,
                height: "100%",
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.grey[300],
                  },
                  '&:hover fieldset': {
                    borderColor: colors.grey[500],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.greenAccent[700],
                  },
                },
                '& .MuiInputLabel-root': {
                  color: colors.grey[400],
                  '&.Mui-focused': {
                    color: colors.greenAccent[700], 
                  },
                },
                '& .MuiInputBase-input': { 
                  color: colors.grey[100],          
                },
              }}
            />
          </Grid>
        </Grid> 

        <Grid item xs={12}>
          <Box
            m="0px 0 0 0"
            height={isMobile ? "75vh" : "100vh"}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
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
              "& .MuiDataGrid-toolbarContainer svg": {
                color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
              },
            }}
          >
            <DataGrid
              checkboxSelection 
              hideFooterSelectedRowCount
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
            <Menu 
              id={`split-button-menu-${openMenuId}`}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleClose} sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}>
                Extend
              </MenuItem>
              <MenuItem onClick={handleClose} sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}>
                Stop Plan
              </MenuItem>
              <MenuItem onClick={handleClose} sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}>
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Grid>

        {/* View Modal (Same as in TeamManager) */}
        <Modal
          open={openViewModal}
          onClose={handleCloseModal}
          aria-labelledby="view-customer-modal" 
          aria-describedby="view-customer-details" 
        >
          <Box sx={style}>
            {selectedCustomer && (
              <div>
                <Typography id="view-customer-modal" variant="h6" component="h2">
                  {selectedCustomer.name} - Customer Details
                </Typography>
                <Typography id="view-customer-details" sx={{ mt: 2 }}>
                  <strong>User ID:</strong> {selectedCustomer.userId}<br />
                  <strong>Email:</strong> {selectedCustomer.email}<br />
                  <strong>Phone Number:</strong> {selectedCustomer.phoneNumber}<br />
                  <strong>Location:</strong> {selectedCustomer.location}<br />
                  <strong>Plan:</strong> {selectedCustomer.plan}
                </Typography>
                <Button variant='outlined' onClick={handleCloseModal} color="inherit">Close</Button> 
              </div>
            )}
          </Box>
        </Modal>
      </Grid>
    </Box>
  );
};

export default CustomerManager;