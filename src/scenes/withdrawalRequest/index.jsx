import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, 
  Modal, Menu, MenuItem, TablePagination, IconButton, Link 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import { withdrawalRequestsData } from "../../data/mockData"; // Import mock data
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const WithdrawalRequest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  const handleView = (request) => {
    setSelectedRequest(request);
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
            / Withdrawal Requests
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Withdrawal Request Overview
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            Approve or decline withdrawal requests. 
          </Typography>
        </Box>
      </Box>

      {/* Table for withdrawal requests */}
      <TableContainer component={Paper} sx={{ mt: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Event Date</TableCell>
              <TableCell>Event Name</TableCell>
              <TableCell>Amount Requested</TableCell>
              <TableCell>Amount Contributed</TableCell>
              <TableCell>Event ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawalRequestsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.eventDate}</TableCell>
                <TableCell>{request.eventName}</TableCell>
                <TableCell>{request.amountRequested}</TableCell>
                <TableCell>{request.amountContributed}</TableCell>
                <TableCell>{request.eventId}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  {/* View Button */}
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleView(request)}
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

                  {/* Menu for Approve/Decline */}
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
                    <MenuItem onClick={handleClose}>Approve</MenuItem>
                    <MenuItem onClick={handleClose}>Decline</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination 
        component="div"
        count={withdrawalRequestsData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />

      {/* View Modal */}
      <Modal
        open={openViewModal}
        onClose={handleCloseModal}
        aria-labelledby="view-request-modal"
        aria-describedby="view-request-details"
      >
        <Box sx={style}>
          {selectedRequest && (
            <div>
              <Typography id="view-request-modal" variant="h6" component="h2">
                {selectedRequest.eventName} - Withdrawal Request
              </Typography>
              <Typography id="view-request-details" sx={{ mt: 2 }}>
                <strong>Event Date:</strong> {selectedRequest.eventDate}<br />
                <strong>Amount Requested:</strong> {selectedRequest.amountRequested}<br />
                <strong>Amount Contributed:</strong> {selectedRequest.amountContributed}<br />
                <strong>Event ID:</strong> {selectedRequest.eventId}<br />
                <strong>Status:</strong> {selectedRequest.status}
              </Typography>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Close</Button> 
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default WithdrawalRequest;