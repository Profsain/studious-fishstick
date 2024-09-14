import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, 
  Modal, Menu, MenuItem, TablePagination, IconButton, Link 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { advertData } from "../../data/mockData"; // Import mock data
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const AdvertManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState(null);

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

  const handleView = (advert) => {
    setSelectedAdvert(advert);
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
            / Adverts
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Advert Management
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            Create, view, edit, and manage advertisements.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { /* Handle Create New Advert action */ }}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            marginRight: "15px",
          }}
        >
          <AddOutlinedIcon sx={{ mr: "10px" }} />
          Create New Advert
        </Button>
      </Box>

      {/* Table for adverts */}
      <TableContainer component={Paper} sx={{ mt: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Ads Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advertData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((advert) => (
              <TableRow key={advert.id}>
                <TableCell>{advert.startDate}</TableCell>
                <TableCell>{advert.endDate}</TableCell>
                <TableCell>{advert.businessName}</TableCell>
                <TableCell>{advert.address}</TableCell>
                <TableCell>{advert.phone}</TableCell>
                <TableCell>{advert.adsStatus}</TableCell>
                <TableCell>
                  {/* View Button */}
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleView(advert)}
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

                  {/* Menu for Actions (Edit, Pause, Delete) */}
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
                    <MenuItem onClick={handleClose}>Edit</MenuItem>
                    <MenuItem onClick={handleClose}>Pause</MenuItem>
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
        count={advertData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />

      {/* View Modal */}
      <Modal
        open={openViewModal}
        onClose={handleCloseModal}
        aria-labelledby="view-advert-modal"
        aria-describedby="view-advert-details"
      >
        <Box sx={style}>
          {selectedAdvert && (
            <div>
              <Typography id="view-advert-modal" variant="h6" component="h2">
                {selectedAdvert.businessName} - Advert Details
              </Typography>
              <Typography id="view-advert-details" sx={{ mt: 2 }}>
                <strong>Start Date:</strong> {selectedAdvert.startDate}<br />
                <strong>End Date:</strong> {selectedAdvert.endDate}<br />
                <strong>Address:</strong> {selectedAdvert.address}<br />
                <strong>Phone:</strong> {selectedAdvert.phone}<br />
                <strong>Ads Status:</strong> {selectedAdvert.adsStatus}
              </Typography>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Close</Button> 
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AdvertManager;