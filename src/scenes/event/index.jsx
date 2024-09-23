import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Box, Typography, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal, InputBase, InputAdornment, IconButton, CircularProgress,
  Divider,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';

const EventManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    console.log("API URL:", `${apiUrl}/events`); // Add this line

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/event`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        // More informative error handling
        if (response.status === 404) {
          throw new Error('Events endpoint not found! Check API URL.');
        } else if (response.status === 401) {
          // Handle token expiration or invalidation (e.g., redirect to login)
          throw new Error('Unauthorized: Token might be invalid or expired.');
        } else {
          // Try to parse the error response for a message from the backend
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Server error!';
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (error) {
      console.error('Error fetching events:', error);

      // Consider a more user-friendly error display (e.g., a toast notification)
      toast.error(`Failed to load events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredRows = events.filter((row) => {
    const search = searchText.toLowerCase();
    return (
      (row.eventName?.toLowerCase() ?? '').includes(search) ||
      (row.eventLocation?.toLowerCase() ?? '').includes(search) ||
      (row.eventCategory?.toLowerCase() ?? '').includes(search)
    );
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none'
  };

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
    navigate(`/event/EditEvent/${id}`);
  };

  const handleSplitBudget = (id) => {
    navigate(`/event/SplitBudget/${id}`);
  };
  const handleDelete = async (eventId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure you want to delete this event?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId)); // Updated to use eventId
          Swal.fire('Deleted!', 'The event has been deleted.', 'success');
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || 'Error deleting event.');
          } catch (jsonError) {
            toast.error('Failed to delete event. Please try again later.');
          }
        }
      }
    } catch (error) {
      toast.error('An error occurred while deleting the event.');
    }
  };


  const columns = [
    {
      field: 'eventDate',
      headerName: 'Date',
      width: 120,
      valueGetter: (params) => {
        const date = new Date(params.row.eventDate);
        return moment(date).format('MM/DD/YYYY');
      }
    },
    { // New image banner column
      field: 'eventImage', // Assuming this is the field name in your API data
      headerName: 'Event Banner',
      width: 150, // Adjust width as needed
      renderCell: (params) => (
        <img 
          src={params.row.eventImage} 
          alt="Event Banner"
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
      )
    },
    { field: 'eventName', headerName: 'Event Name', flex: 1 },
    { field: 'eventLocation', headerName: 'Address', flex: 1 },
    { field: 'eventCost', headerName: 'Budget', width: 100 },
    { field: 'eventCategory', headerName: 'Category', flex: 1 },
    { field: 'createdBy', headerName: 'Created By', width: 150 },
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
            onClick={(event) => handleClick(event, params.row.id)}
            endIcon={<ArrowDropDownIcon />}
          >
          </Button>

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
                handleEdit(openMenuId);
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
              onClick={() => navigate(`/event/CreateEvent`)}
            >
              <CalendarTodayOutlinedIcon sx={{ mr: "10px" }} />
              Add Event
            </Button>
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
             {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="60%">
                {/* <Box align="center" display='flex'>
                  <Typography variant="h4" align="center" display='flex' color="colors.greenAccent[500]">
                    Loading Team...<br />
                  </Typography>
                </Box> */}
                <CircularProgress
                  size={50}
                  thickness={5}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            ) : (
              <DataGrid
                checkboxSelection
                hideFooterSelectedRowCount
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                getRowId={(row) => row._id}
              />
            )}

            {/* View Modal */}
            <Modal
              open={openViewModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {selectedEvent && (
                  <div>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                      {selectedEvent.eventName}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Date:</strong> {moment(selectedEvent.eventDate).format('MMMM Do YYYY')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Location:</strong> {selectedEvent.eventLocation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Budget:</strong> ${selectedEvent.eventCost}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Category:</strong> {selectedEvent.eventCategory}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Created By:</strong> {selectedEvent.createdBy}
                    </Typography>
                    <Divider sx={{ my: 2 }} /> {/* Divider between details and buttons */}
                    <Button
                      variant="contained"
                      onClick={handleCloseModal}
                      sx={{ mt: 2, mr: 2, backgroundColor: colors.greenAccent[700] }}
                    >
                      Close
                    </Button>
                    {/* Add Edit and Split Budget buttons here if needed */}
                  </div>
                )}
              </Box>
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventManager;