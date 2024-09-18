


import React, { useState } from 'react';
import {
    Box, Typography, Button,
    Modal, Menu, MenuItem, IconButton, Link, Grid
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { advertData } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid"; // Removed GridToolbar import
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Chip from '@mui/material/Chip';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";


const AdvertManager = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedAdvert, setSelectedAdvert] = useState(null);

    // State for the dropdown menu
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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

    const handleView = (advert) => {
        setSelectedAdvert(advert);
        setOpenViewModal(true);
    };

    const handleCloseModal = () => {
        setOpenViewModal(false);
    };

    const columns = [
        // ID column removed
        {
            field: "startDate",
            headerName: "Start Date",
            width: 100,
            editable: true,
        },
        {
            field: "endDate",
            headerName: "End Date",
            width: 100,
            editable: true,
        },
        {
            field: "businessName",
            headerName: "Business Name",
            width: 200,
            editable: true,
        },
        {
            field: "address",
            headerName: "Address",
            width: 200,
            editable: true,
        },
        {
            field: "phone",
            headerName: "Phone",
            type: "number",
            width: 150,
            editable: true,
        },
        {
            field: 'adsStatus',
            headerName: 'Ads Status',
            width: 100,
            renderCell: ({ row: { adsStatus } }) => {
                return (
                    <Chip
                        label={adsStatus}
                        color={adsStatus === 'Active' ? 'success' : 'error'}
                    />
                );
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            type: "actions",
            getActions: (params) => [
                <Grid item xs={12} md={6} lg={4}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            handleView(params.row);
                        }}
                        sx={{
                            backgroundColor: '#fa7c50',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#f86a3b',
                            },
                        }}
                    >
                        View
                    </Button>
                </Grid>,
                <IconButton
                    aria-label="actions"
                    aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{
                        color: '#fa7c50',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    <MoreVertIcon />
                </IconButton>,
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
                </Menu>,
            ],
        },
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
                        <Link href="/" style={{ textDecoration: 'none', color: colors.grey[100] }}>
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
                <Box display="flex">
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
                        Add Advert
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Export
                    </Button>
                </Box>
            </Box>
            <Box
                m="40px 0 0 0"
                height="100vh"
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
                        color: `${-colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    checkboxSelection
                    hideFooterSelectedRowCount
                    rows={advertData}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            </Box>
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