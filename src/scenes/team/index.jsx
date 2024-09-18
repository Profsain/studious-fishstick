import React, { useState } from 'react';
import {
  Box, Typography, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { teamData } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Chip from '@mui/material/Chip';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';

const TeamManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    {
      field: "staffId",
      headerName: "Staff ID",
      width: 130,
      editable: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 120,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "location",
      headerName: "Location",
      width: 160,
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 140,
      renderCell: ({ row: { role } }) => {
        return (
          <Chip
            label={role}
            color={role === 'Admin' | 'Super Admin' ? 'primary' : 'secondary'}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <ButtonGroup variant="contained">
          <Button
            onClick={() => handleView(params.row)}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.blueAccent[800],
              },
            }}
          >
            View
          </Button>
          <Button
            size="small"
            aria-controls={`split-button-menu-${params.id}`}
            aria-expanded={openMenuId === params.id ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={(event) => handleClick(event, params.id)}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.blueAccent[800],
              },
            }}
          >
            <ArrowDropDownIcon />
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
              rows={teamData}
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

