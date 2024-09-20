import React, { useState } from 'react';
import {
  Box, Typography, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal, InputBase, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { subscriptionData } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const SubscriptionManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredRows = subscriptionData.filter((row) => {
    const search = searchText.toLowerCase();
    return (
      (row.name?.toLowerCase() ?? '').includes(search) ||
      (row.location?.toLowerCase() ?? '').includes(search) ||
      (row.planName?.toLowerCase() ?? '').includes(search)
    );
  });

  // Modal style
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

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleView = (subscription) => {
    setSelectedSubscription(subscription);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: 'planAmount', headerName: 'Plan Amount', width: 120 },
    { field: "planName", headerName: "Plan Name", flex: 1 },
    { field: "recurring", headerName: "Recurring", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200, // Adjust width as needed
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
          {/* Action Dropdown Button */}
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
          {/* Actions Menu */}
          <Menu
            id={`actions-menu-${openMenuId}`}
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
            / Subscriptions
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Subscription Management
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            View and manage user subscriptions
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={1} justifyContent={isMobile ? "flex-start" : "flex-end"}>
          <Grid item>
            <InputBase
              sx={{
                mr: 2,
                flex: 1,
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
              placeholder="Search Subscriptions..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
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
          </Box>
        </Grid>

        {/* View Subscription Modal */}
        <Modal
          open={openViewModal} 
          onClose={handleCloseModal} 
          aria-labelledby="view-subscription-modal"
          aria-describedby="view-subscription-details"
        >
          <Box sx={style}>
            {selectedSubscription && (
              <div>
                <Typography id="view-subscription-modal" variant="h6" component="h2">
                  {selectedSubscription.name} - Subscription Details
                </Typography>
                <Typography id="view-subscription-details" sx={{ mt: 2 }}>
                  {/* Display subscription details here */}
                  <strong>Name:</strong> {selectedSubscription.name}<br />
                  <strong>Location:</strong> {selectedSubscription.location}<br />
                  <strong>Plan Amount:</strong> {selectedSubscription.planAmount}<br />
                  <strong>Plan Name:</strong> {selectedSubscription.planName}<br />
                  <strong>Recurring:</strong> {selectedSubscription.recurring ? 'Yes' : 'No'}<br />
                  <strong>Status:</strong> {selectedSubscription.status}
                </Typography>
                <Button variant='outlined' onClick={handleCloseModal} color="inherit">
                  Close
                </Button>
              </div>
            )}
          </Box>
        </Modal>
      </Grid>
    </Box>
  );
};

export default SubscriptionManager;