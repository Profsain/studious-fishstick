import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, 
  Modal, Menu, MenuItem, TablePagination, IconButton, Link 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import { customerData } from "../../data/mockData"; // Import mock data
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const CustomerManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  const handleView = (customer) => {
    setSelectedCustomer(customer);
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
            / Customers
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Customer Management
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            View and manage your customers.
          </Typography>
        </Box>
      </Box>

      {/* Table for customers */}
      <TableContainer component={Paper} sx={{ mt: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.userId}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.location}</TableCell>
                <TableCell>{customer.plan}</TableCell>
                <TableCell>
                  {/* View Button */}
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleView(customer)}
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

                  {/* Menu for Actions (Extend, Stop Plan, Delete) */}
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
                    <MenuItem onClick={handleClose}>Extend</MenuItem>
                    <MenuItem onClick={handleClose}>Stop Plan</MenuItem>
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
        count={customerData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />

      {/* View Modal */}
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
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Close</Button> 
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomerManager;