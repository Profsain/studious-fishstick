import React, { useState } from 'react';
import {
  Box, Typography, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal, InputBase, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { teamData } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';

const TeamManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');


  const filteredRows = teamData.filter((row) => {
    const search = searchText.toLowerCase();
    return (
      (row.name?.toLowerCase() ?? '').includes(search) ||
      (row.email?.toLowerCase() ?? '').includes(search) ||
      (row.staffId?.toLowerCase() ?? '').includes(search)
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
  const handleView = (member) => {
    setSelectedTeamMember(member);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const columns = [
    { field: "staffId", headerName: "Staff ID", width: 130 },
    { field: "name", headerName: "Name", flex: 1 }, // Use flex for responsiveness
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
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
            onClick={(event) => handleClick(event, params.id)}
            endIcon={<ArrowDropDownIcon />} // Add the ArrowDropDownIcon
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
                backgroundColor: colors.greenAccent[600],
                color: colors.grey[100],
                fontSize: "16px",
                fontWeight: "600",
                padding: "10px 20px",
                marginRight: isMobile ? "0" : "0px",
                marginBottom: isMobile ? "10px" : "0",
                '&:hover': {
                  backgroundColor: colors.greenAccent[600], // Darker green on hover
                },

              }}
            >
              <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
              Add Team
            </Button>
          </Grid>

        </Grid>
        <Grid item xs={12}>
          <Box
            m="0px 0 0 0" // Adjusted top margin
            height={isMobile ? "75vh" : "100vh"} // Responsive height
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
                Delete
              </MenuItem>
            </Menu>
          </Box>        </Grid>
      </Grid>
      {/* View Modal */}
      <Modal
        open={openViewModal}
        onClose={handleCloseModal}
        aria-labelledby="view-team-member-modal"
        aria-describedby="view-team-member-details"
      >
        <Box sx={style}>
          {selectedTeamMember && (
            <div>
              <Typography id="view-team-member-modal" variant="h6" component="h2">
                {selectedTeamMember.name}
              </Typography>
              <Typography id="view-team-member-details" sx={{ mt: 2 }}>
                <strong>Staff ID:</strong> {selectedTeamMember.staffId}<br />
                <strong>Email:</strong> {selectedTeamMember.email}<br />
                <strong>Phone Number:</strong> {selectedTeamMember.phone}<br />
                <strong>Location:</strong> {selectedTeamMember.location}<br />
                <strong>Role:</strong> {selectedTeamMember.role}
              </Typography>
              <Button variant='outlined' onClick={handleCloseModal} color="inherit">Close</Button>
            </div>
          )}
        </Box>
      </Modal>

    </Box>
  );
};

export default TeamManager;

