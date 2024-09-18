import React, { useState, useEffect, useRef } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

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
  const [adminData, setAdminData] = useState(null); // State to hold admin data

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

   useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('https://splinx-server.onrender.com/admin/admin-get-all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAdminData(data.admins[0]); // Assuming you want the first admin
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);


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
          {/* LOGO AND MENU ICON */}
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
                  ADMIN
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
                    <AddCircleOutlineIcon
                      sx={{ color: "white", fontSize: 30 }}
                    />
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
        {adminData && (
          <>
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "10px 0 0 0" }}
            >
              {adminData.firstName} {adminData.lastName}
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[500]}>
              {adminData.role}
            </Typography>
          </>
        )}
      </Box>
    </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Manager
            </Typography>

            <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Manage Customer"
              to="/customer-manager"
              icon={<span className="material-symbols-outlined">groups</span>}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Event Manager"
              to="/events"
              icon={
                <span className="material-symbols-outlined">event_available</span>
              }
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Advert Manager"
              to="/advert-manager"
              icon={<span className="material-symbols-outlined">campaign</span>}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Withdrawal Request"
              to="/withdrawal"
              icon={<span className="material-symbols-outlined">attach_money</span>}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Subscriptions Manager"
              to="/subscriptions"
              icon={
                <span className="material-symbols-outlined">subscriptions</span>
              }
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Promo Code"
              to="/promo-code"
              icon={<span className="material-symbols-outlined">app_promo</span>}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Push Notification"
              to="/push-notification"
              icon={
                <span className="material-symbols-outlined">notifications</span>
              }
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Email Notification"
              to="/email-notification"
              icon={
                <span className="material-symbols-outlined">mark_email_unread</span>
              }
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              More
            </Typography>
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
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
