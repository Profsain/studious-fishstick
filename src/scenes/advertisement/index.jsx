import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { advertData } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Chip from '@mui/material/Chip';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import useMediaQuery from '@mui/material/useMediaQuery'; 

const AdvertManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');

  const filteredRows = advertData.filter((row) =>
    row.businessName.toLowerCase().includes(searchText.toLowerCase()) ||
    row.address.toLowerCase().includes(searchText.toLowerCase()) ||
    row.phone.toString().toLowerCase().includes(searchText.toLowerCase())
  );

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

  const handleView = (advert) => {
    setSelectedAdvert(advert);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const columns = [
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "endDate", headerName: "End Date", width: 130 },
    { field: "businessName", headerName: "Business Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { 
      field: 'adsStatus', 
      headerName: 'Ads Status', 
      width: 150, 
      renderCell: ({ row: { adsStatus } }) => (
        <Chip 
          label={adsStatus} 
          color={adsStatus === 'Active' ? 'success' : 'error'} 
        />
      ) 
    },
    {
      field: "actions",
      headerName: "Actions",
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
            / Adverts
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Advert Management
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            Create, view, edit, and manage advertisements.
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
              <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
              Add Advert
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
              "& .name-column--cell": {
                color: colors.greenAccent[300],
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
                Edit
              </MenuItem>
              <MenuItem onClick={handleClose} sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}>
                Pause
              </MenuItem>
              <MenuItem onClick={handleClose} sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}>
                Delete
              </MenuItem>
            </Menu>
          </Box>        </Grid>
      </Grid>
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