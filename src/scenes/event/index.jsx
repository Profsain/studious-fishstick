import React, { useState } from 'react';
import {
  Box, IconButton, Typography, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal, InputBase, InputAdornment
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { eventsData } from '../../data/mockData'; // Import mock event data 
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from 'react-toastify';

const EventManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');

  // Filter event data based on search text
  const filteredRows = eventsData.filter((row) => {
    const search = searchText.toLowerCase();
    return (
      (row.eventName?.toLowerCase() ?? '').includes(search) ||
      (row.eventLocation?.toLowerCase() ?? '').includes(search) ||
      (row.eventCategory?.toLowerCase() ?? '').includes(search)
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

  const handleView = (event) => {
    setSelectedEvent(event);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const handleEdit = (id) => {
    // TODO: Implement edit logic (e.g., open a modal to edit the event)
    toast.success(`Editing Event with ID: ${id}`);
    console.log("Editing event with ID:", id);
  };

  const handleSplitBudget = (id) => {
    // TODO: Implement split budget logic
    toast.success(`Splitting budget for Event with ID: ${id}`);
    console.log("Splitting budget for event with ID:", id);
  };

  const handleDelete = (id) => {
    // TODO: Implement delete logic (e.g., send a DELETE request to your API)
    toast.success(`Deleting Event with ID: ${id}`);
    console.log("Deleting event with ID:", id);
  };

  // Define the DataGrid columns
  const columns = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'eventName', headerName: 'Event Name', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'budget', headerName: 'Budget', width: 100 }, // Adjust width as needed
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'createdBy', headerName: 'Created By', width: 150 }, // Adjust width as needed
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
            / Events
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Event Management
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            Add, view, edit, and manage your events
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
                backgroundColor: colors.greenAccent[700],
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
            >
              <CalendarTodayOutlinedIcon sx={{ mr: "10px" }} /> {/* Use a calendar icon */}
              Add Event
            </Button>
          </Grid>
        </Grid>

        {/* DataGrid for displaying Events */}
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
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleEdit(openMenuId); // Assuming openMenuId is the event ID
                }}
                sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleSplitBudget(openMenuId);
                }}
                sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}
              >
                Split Budget
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleDelete(openMenuId);
                }}
                sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Grid>

        {/* View Event Modal */}
        <Modal
          open={openViewModal}
          onClose={handleCloseModal}
          aria-labelledby="view-event-modal"
          aria-describedby="view-event-details"
        >
          <Box sx={style}>
            {selectedEvent && (
              <div>
                <Typography id="view-event-modal" variant="h6" component="h2">
                  {selectedEvent.eventName} - Event Details
                </Typography>
                <Typography id="view-event-details" sx={{ mt: 2 }}>
                  <strong>Date:</strong> {selectedEvent.date}<br /> 
                  <strong>Event Name:</strong> {selectedEvent.eventName}<br />
                  <strong>Address:</strong> {selectedEvent.address}<br />
                  <strong>Budget:</strong> {selectedEvent.budget}<br />
                  <strong>Category:</strong> {selectedEvent.category}<br />
                  <strong>Created By:</strong> {selectedEvent.createdBy} 
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

export default EventManager;