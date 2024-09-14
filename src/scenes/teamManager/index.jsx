import React, { useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, Paper, Button,
    Modal, Menu, MenuItem, IconButton, Link
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { teamData } from "../../data/mockData";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const TeamManager = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);

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

    const handleView = (member) => {
        setSelectedTeamMember(member);
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
                        / Team
                    </Typography>
                    <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
                        Team Overview
                    </Typography>
                    <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
                    Add, view, edit, and manage your team members
                                        </Typography>
                </Box>
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "15px",
                    }}
                >
                    <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
                    Add Team
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: '20px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow> <TableCell>Staff ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell> </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => (
                            <TableRow key={member.id}><TableCell>{member.staffId}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell>{member.location}</TableCell>
                                <TableCell>{member.role}</TableCell><TableCell>
                                    {/* View Button */}
                                    <Button 
  variant="outlined" 
  size="small" 
  onClick={() => handleView(member)}
  sx={{ 
    color: colors.greenAccent[500], // Use a contrasting color from your theme
    borderColor: colors.greenAccent[500], // Match the border color
    '&:hover': {
      backgroundColor: colors.greenAccent[700], // Darken the background on hover
      borderColor: colors.greenAccent[700], // Match border on hover
      color: colors.grey[100], // Make text white on hover
    },
  }}
>
  View
</Button>

                                    <IconButton
                                        aria-label="actions"
                                        aria-controls={isMenuOpen ? 'basic-menu' : undefined} // Use isMenuOpen
                                        aria-haspopup="true"
                                        aria-expanded={isMenuOpen ? 'true' : undefined} // Use isMenuOpen
                                        onClick={handleClick}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={isMenuOpen} // Use isMenuOpen here as well
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={teamData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

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