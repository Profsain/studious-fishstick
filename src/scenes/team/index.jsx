import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Grid,
  Menu,
  MenuItem,
  Link,
  Avatar
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import AdminViewModal from "./AdminViewModal"; // Import the AdminViewModal
import ConfirmationDialog from "./ConfirmationDialog"; // Import the ConfirmationDialog
import CreateNewAdmin from "./CreateNewAdmin";
import EditAdmin from "./EditAdmin";
import AuthContext from "../../context/AuthContext";

const TeamManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);

  const [adminData, setAdminData] = useState(null);
  const fetchAdmins = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/admin-get-all`, { // Closing bracket added here
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data) {
        setAdminData(data.admins);
      } else {
        setAdminData([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  }, [apiUrl, token]); 

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredRows = adminData?.filter(
    (row) =>
      row.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      row.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      row.phoneNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      row.emailAddress.toLowerCase().includes(searchText.toLowerCase()) ||
      row.staffId.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  // Create a new admin
  const [openCreateAdmin, setOpenCreateAdmin] = useState(false);
  const handleCreateAdmin = () => {
    // toggle the state of the modal
    setOpenCreateAdmin((prev) => !prev);
  };

  // Edit an admin
  const [openEditAdmin, setOpenEditAdmin] = useState(false);
  const handleEdit = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin to edit
    setOpenEditAdmin(true); // Open the edit modal
  };

  const handleCloseEditModal = () => {
    setOpenEditAdmin(false);
    setSelectedAdmin(null); // Reset selected admin
  };

  // Delete an admin
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/admin/admin-delete/${adminToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setAdminData((prevData) =>
          prevData.filter((item) => item._id !== adminToDelete._id)
        );
        alert("Success", "Admin deleted successfully!");
      } else {
        const errorData = await response.json();
        alert("Error", errorData.message || "Failed to delete the admin.");
      }
    } catch (error) {
      alert("Error", "Failed to delete the admin.");
    } finally {
      setOpenConfirmDialog(false);
      setAdminToDelete(null);
    }
  };

  const columns = [
    { field: "staffId", headerName: "Staff ID", width: 130 },
    { field: "firstName", headerName: "Firstname", flex: 1 },
    { field: "lastName", headerName: "Surname", flex: 1 },
    { field: "emailAddress", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "city", headerName: "Location", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
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
              color: "white",
              "&:hover": {
                backgroundColor: "#f86a3b",
              },
            }}
            onClick={() => handleView(params.row)}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
          <Button
            sx={{
              backgroundColor: "#fa7c50",
              color: "white",
              "&:hover": {
                backgroundColor: "#f86a3b",
              },
            }}
            onClick={(event) => handleClick(event, params.id)}
            endIcon={<ArrowDropDownIcon />}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && openMenuId === params.id}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleEdit(params.row)}>Edit</MenuItem>
            <MenuItem onClick={() => handleDelete(params.row)}>Delete</MenuItem>
          </Menu>
        </ButtonGroup>
      ),
    },
  ];

  // fetch admin when edit or create modal is closed
  useEffect(() => {
    if (!openCreateAdmin && !openEditAdmin) {
      fetchAdmins();
    }
  }, [openCreateAdmin, openEditAdmin, fetchAdmins]);


  return (
    <>
      {/* show create new admin or table */}
      {openCreateAdmin ? (
        <CreateNewAdmin handleCancel={handleCreateAdmin} />
      ) : openEditAdmin ? ( // Render EditAdmin component if editing
        <EditAdmin
          adminData={selectedAdmin}
          handleCancel={handleCloseEditModal}
        />
      ) : (
        <Box m="20px">
          {/* Header and Create New Admin Button */}
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12}>
              <Typography
                variant="h6"
                fontWeight="600"
                color={colors.grey[100]}
              >
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: colors.grey[100] }}
                >
                  Home
                </Link>{" "}
                / Team
              </Typography>
              <Typography
                variant="h2"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Team Management
              </Typography>
              <Typography
                variant="subtitle2"
                fontSize={"16px"}
                color={colors.greenAccent[500]}
              >
                Add, view, edit, and manage your team members
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              spacing={1}
              justifyContent={isMobile ? "flex-start" : "flex-end"}
            >
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
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: colors.grey[300] },
                      "&:hover fieldset": { borderColor: colors.grey[500] },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[700],
                      },
                      // Reduce the padding to decrease height
                      "& input": {
                        padding: "8px 12px", // Adjust these values as needed
                        fontSize: "12px", // Adjust the font size if needed
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[400],
                      "&.Mui-focused": { color: colors.greenAccent[700] },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.grey[100],
                    },
                  }}
                />

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: "white",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[700],
                    },
                  }}
                  onClick={handleCreateAdmin}
                >
                  Create New Admin
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Table */}
          <Box
            m="0px 0 0 0"
            height={isMobile ? "75vh" : "100vh"}
            sx={{
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .name-column--cell": { color: colors.greenAccent[300] },
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
            }}
          >
            <DataGrid
              checkboxSelection
              hideFooterSelectedRowCount
              rows={filteredRows || []}
              getRowId={(row) => row._id}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </Box>

          {/* Use the AdminViewModal */}
          <AdminViewModal
            openViewModal={openViewModal}
            handleCloseModal={handleCloseModal}
            selectedAdmin={selectedAdmin}
          />

          {/* Use the ConfirmationDialog */}
          <ConfirmationDialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
            onConfirm={confirmDelete}
            admin={adminToDelete}
          />
        </Box>
      )}
    </>
  );
};

export default TeamManager;
