import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Menu,
  MenuItem,
  Link,
  InputBase,
  InputAdornment,
  IconButton,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import EditIcon from '@mui/icons-material/Edit';
import { teamData as initialTeamData } from '../../data/mockData';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import ViewModal from '../../components/ViewModal';
import { teamViewFields } from './teamFields';
import EditModal from '../../components/EditModal';

const TeamManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editMemberData, setEditMemberData] = useState(null);

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

  const handleEdit = (member) => {
    setEditMemberData(member);
    setOpenEditModal(true);
  };

  const [teamData, setTeamData] = useState(initialTeamData); // Replace initialTeamData with your initial mock data

  const handleEditSubmit = (values) => {
    console.log('Updating team member with values:', values);

    // 1. Update the local data (replace with your actual API call logic)
    const updatedTeamData = teamData.map((tm) => 
      tm.staffId === values.staffId ? values : tm
    );
    setTeamData(updatedTeamData);

    // 2. Close the Edit Modal 
    setOpenEditModal(false); 
  };
  const filteredRows = teamData.filter((row) => {
    const search = searchText.toLowerCase();
    return (
    (row.name?.toLowerCase() ?? '').includes(search) ||
    (row.email?.toLowerCase() ?? '').includes(search) ||
    (row.staffId?.toLowerCase() ?? '').includes(search)
    );
    });
  const columns = [
    { field: 'staffId', headerName: 'Staff ID', width: 100 },
    {
      field: 'profileImage',
      headerName: 'Profile',
      width: 80,
      renderCell: (params) => (
        <Avatar alt={params.row.name} src={params.row.profileImage} />
      ),
    },
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone Number', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
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
              '&:hover': { backgroundColor: '#f86a3b' },
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
              '&:hover': { backgroundColor: '#f86a3b' },
            }}
            onClick={(event) => handleClick(event, params.row)} // Pass the row data 
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
            {/* Actions Dropdown Menu */}
            <Menu
              id={`split-button-menu-${openMenuId}`}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
              <MenuItem onClick={handleClose} sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}>
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Grid>

        {/* ViewModal */}
        <ViewModal
          open={openViewModal}
          onClose={handleCloseModal}
          recordData={selectedTeamMember}
          fields={teamViewFields}
        >
          {/* Correct way to pass JSX as children */}
          <Button
            variant="contained"
            onClick={() => {
              handleCloseModal();
              handleEdit(selectedTeamMember);
            }}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              '&:hover': { backgroundColor: colors.greenAccent[700] },
              mt: 2,
            }}
          >
            Edit
          </Button>
        </ViewModal>

        {/* EditModal */}
        <EditModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          initialValues={editMemberData}
          onSubmit={handleEditSubmit}
          fields={teamViewFields}
        />
        {/* View Modal */}
        {/* <Modal
        open={openViewModal}
        onClose={handleCloseModal}
        aria-labelledby="view-team-member-modal"
        aria-describedby="view-team-member-details"
      >
        <Box sx={style}>
          {selectedTeamMember && (
            <div>
             <Typography id="view-team-member-modal" variant="h6" component="h2">
        {selectedTeamMember.firstName} {selectedTeamMember.lastName} 
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
      </Modal> */}
      </Grid>
    </Box >
  );
};

export default TeamManager;

