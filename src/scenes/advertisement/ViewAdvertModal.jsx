// src/scenes/advertisement/ViewAdvertModal.js
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  Avatar,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import moment from "moment";

const ViewAdvertModal = ({
  open,
  onClose,
  recordData,
  fields,
  handleEdit,
  handleDelete,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {recordData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Box sx={{ position: "relative" }}>
              {/* Close Button */}
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {/* Advert Information Section */}
              <Grid container spacing={2} alignItems="center" mb={3}>
                <Grid item xs={12} textAlign="center">
                  <Avatar
                    alt="Advert Banner"
                    src={recordData.adsImage}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      border: `5px solid ${colors.greenAccent[500]}`,
                    }}
                  />
                </Grid>

                {/* Business Name, Status */}
                <Grid item xs={12} textAlign="center">
                  <Typography variant="h3" fontWeight="bold" mb={1} color={"#ffb554"}>
                    {recordData.businessName}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Chip
                      label={recordData.adsStatus}
                      color={recordData.adsStatus === "active" ? "success" : "error"}
                      size="medium"
                      sx={{ fontWeight: "bold", fontSize: 16 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Advert Details Section */}
              <Typography variant="h6" color={colors.grey[100]}>
                Advert Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} rowSpacing={1}>

                {/* Start Date */}
                <Grid item xs={12} sm={6} key="startDate">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Start Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(recordData.startDate).format("MMMM Do YYYY")}
                    </Typography>
                  </Box>
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={6} key="endDate">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      End Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(recordData.endDate).format("MMMM Do YYYY")}
                    </Typography>
                  </Box>
                </Grid>

                {/* Business Address */}
                <Grid item xs={12} sm={6} key="businessAddress">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Address:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.businessAddress}
                    </Typography>
                  </Box>
                </Grid>

                {/* Business Phone */}
                <Grid item xs={12} sm={6} key="businessPhone">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Phone:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.businessPhone}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Buttons (Full Width) */}
              <Grid item xs={12} mt={4} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: colors.grey[100],
                    "&:hover": {
                      backgroundColor: colors.greenAccent[700],
                    },
                  }}
                  onClick={onClose}
                >
                  Return to Dashboard
                </Button>
                {/* Edit Button */}
                <IconButton
                  onClick={() => {
                    handleEdit(recordData);
                    onClose();
                  }}
                  aria-label="edit"
                  sx={{ ml: 2, color: colors.greenAccent[600] }}
                >
                  <EditIcon />
                </IconButton>
                {/* Delete Button */}
                <IconButton
                  onClick={() => {
                    handleDelete(recordData);
                    onClose();
                  }}
                  aria-label="delete"
                  sx={{ ml: 2, color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Box>
          </motion.div>
        )}
      </Box>
    </Modal>
  );
};

export default ViewAdvertModal;