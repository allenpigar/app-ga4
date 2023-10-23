
import {
    Link,
  } from "react-router-dom";import NavBar from "../NavBar/NavBar";
import { GoogleAuthOverlay } from "../AuthOverlay";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

const Menu = () => (
    <Paper
      sx={{
        width: 250,
        maxWidth: "100%",
        position: "sticky",
        position: "-webkit-sticky",
        top: 0,
      }}
    >
      <MenuList>
        <MenuItem component={Link} to="/">
          <Typography color="primary" sx={{ fontWeight: "bold" }}>
            Overview
          </Typography>
        </MenuItem>
        <MenuItem component={Link} to="/content">
          <Typography color="primary" sx={{ fontWeight: "bold" }}>
            Pages
          </Typography>
        </MenuItem>
        <MenuItem component={Link} to="/journey">
          <Typography color="primary" sx={{ fontWeight: "bold" }}>
            User Journey
          </Typography>
        </MenuItem>
      </MenuList>
    </Paper>
  );
  

export default function ContentWrapper({ token, userId, instance, isAuthenticated, children }){

    return (
        <>
        <NavBar zuid={instance.ZUID} token={token} />
        <Box
          sx={{
            p: 4,
            marginTop: 10,
          }}
        >
          <GoogleAuthOverlay
            user={userId}
            instance={instance}
            isAuthenticated={isAuthenticated}
          />
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Menu />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            </Box>
        </Box>
        </>
    )

}