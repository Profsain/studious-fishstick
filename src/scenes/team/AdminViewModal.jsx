import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "80vh", // Set a maximum height to make it scrollable
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: "none",
  overflowY: "auto", // Enable vertical scrolling
};

const AdminViewModal = ({ openViewModal, handleCloseModal, selectedAdmin }) => {
  return (
    <Modal
      open={openViewModal}
      onClose={handleCloseModal}
      aria-labelledby="view-admin-modal"
      aria-describedby="view-admin-details"
    >
      <Box sx={style}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4" id="view-admin-modal" gutterBottom>
            Admin Details
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            size="small"
            sx={{ color: "gray" }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {selectedAdmin && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                <strong>
                  {selectedAdmin.firstName} {selectedAdmin.lastName}
                </strong>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Staff ID:</strong> {selectedAdmin.staffId}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedAdmin.emailAddress}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Phone Number:</strong> {selectedAdmin.phoneNumber}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Location:</strong> {selectedAdmin.city}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Role:</strong> {selectedAdmin.role}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Country:</strong> {selectedAdmin.country}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Address:</strong> {selectedAdmin.address}
              </Typography>
            </Grid>

            {/* Next of Kin section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <strong>Next of Kin</strong>
              </Typography>

              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Full Name:</strong> {selectedAdmin.nextOfKin?.fullName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Phone Number:</strong>{" "}
                {selectedAdmin.nextOfKin?.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedAdmin.nextOfKin?.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Address:</strong> {selectedAdmin.nextOfKin?.address}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default AdminViewModal;
