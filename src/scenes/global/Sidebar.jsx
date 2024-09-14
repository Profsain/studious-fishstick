import React, { useState, useRef } from 'react';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [profileImage, setProfileImage] = useState("../../assets/user.png");
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
      <Box mb="25px">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            alt="profile-user"
            width="100px"
            height="100px"
            src={profileImage}
            style={{ cursor: "pointer", borderRadius: "50%" }}
            onClick={handleImageClick}
          />
          {isHovered && (
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)", 
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" }, 
              }}
              onClick={handleImageClick}
            >
              <AddCircleOutlineIcon sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </Box>
        <Box textAlign="center">
          <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "10px 0 0 0" }}
          >
            Splinx Planet
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[500]}>
            Super Admin
          </Typography>
        </Box>
      </Box>
    )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
          
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Tasks
            </Typography>
            <Item
              title="Team Manager"
              to="/team-manager"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
               <Item
              title="Customer Manager"
              to="/customer-manager"
              icon={<ManageAccountsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
    title="Adverts Manager"
    to="/advert-manager"
    icon={<StorefrontOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
  />
       <Item
    title="Events Manager"
    to="/events-manager"
    icon={<EventOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
  />
   <Item
    title="Withdrawal Request"
    to="/withdrawal-request"
    icon={<SavingsOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
  />
   <Item
    title="Subscription Manager"
    to="/subscription-manager"
    icon={<CardGiftcardOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
  />
  <Item
              title="Promo Manager"
              to="/promo-manager"
              icon={<LocalOfferOutlinedIcon />} 
              selected={selected}
              setSelected={setSelected}
            />
  <Item
    title="Push Notification"
    to="/push-notification"
    icon={<NotificationsActiveOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
  />
  
  <Item
    title="Email Notification"
    to="/email-notification"
    icon={<EmailOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
  />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;