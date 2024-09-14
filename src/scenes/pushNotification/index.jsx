import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, 
  Modal, Menu, MenuItem, TablePagination, IconButton, Link 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import { pushNotificationsData } from "../../data/mockData"; // Import mock data
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const PushNotification = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

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

  // State for the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
            <Link to="/" style={{ textDecoration: 'none', color: colors.grey[100] }}>
              Home
            </Link>{' '}
            / Push Notifications
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Push Notifications
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            Manage and send push notifications to users.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { /* Handle Send New action */ }}
          sx={{
            backgroundColor: colors.blueAccent[700], // Use your theme color 
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            marginRight: "15px",
          }}
        >
          Send New
        </Button>
      </Box>

      {/* Table for push notifications */}
      <TableContainer component={Paper} sx={{ mt: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pushNotificationsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.date}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>{notification.recipient}</TableCell>
                <TableCell>{notification.createdBy}</TableCell>
                <TableCell>{notification.status}</TableCell>
                <TableCell>
                  {/* View Button */}
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleView(notification)}
                    sx={{ 
                      color: colors.greenAccent[500],
                      borderColor: colors.greenAccent[500],
                      '&:hover': {
                        backgroundColor: colors.greenAccent[700],
                        borderColor: colors.greenAccent[700],
                        color: colors.grey[100],
                      },
                    }}
                  >
                    View
                  </Button>

                  {/* Menu for Actions (Resend, Delete, etc.) */}
                  <IconButton 
                    aria-label="actions"
                    aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MoreVertIcon /> 
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}>Resend</MenuItem>
                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination 
        component="div"
        count={pushNotificationsData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />

      {/* View Modal */}
      <Modal
        open={openViewModal}
        onClose={handleCloseModal}
        aria-labelledby="view-notification-modal"
        aria-describedby="view-notification-details"
      >
        <Box sx={style}>
          {selectedNotification && (
            <div>
              <Typography id="view-notification-modal" variant="h6" component="h2">
                Push Notification Details
              </Typography>
              <Typography id="view-notification-details" sx={{ mt: 2 }}>
                <strong>Date:</strong> {selectedNotification.date}<br />
                <strong>Message:</strong> {selectedNotification.message}<br />
                <strong>Recipient:</strong> {selectedNotification.recipient}<br />
                <strong>Created By:</strong> {selectedNotification.createdBy}<br />
                <strong>Status:</strong> {selectedNotification.status}
              </Typography>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Close</Button> 
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default PushNotification;