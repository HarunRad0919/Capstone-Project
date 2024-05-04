import React, { useState } from 'react';
import Logo from "../Assets/Logo.jpg";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Box, Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { List } from '@mui/material'; 



export const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const menuOption = [
        {
            text: "Home",
            icon: <HomeIcon />,
        },
        {
            text: "Login/SignUp",
            icon: <CommentRoundedIcon />,
        },  
        {
            text: "Transactions",
            icon: <InfoIcon />,
        },   
        {
            text: "Budget Tracking",
            icon: <ShoppingCartRoundedIcon />,
        },   
        {
            text: "Contact",
            icon: <PhoneRoundedIcon />,
        }          
    ];
return (
    <nav>
        <div className='nav-logo-container'>
            <img src={Logo} alt=""  />
        </div>
        <div className='navbar-links-container'>
            <a href=''>Home</a>
            <a href=''>Contact</a>
            <a href=''>Budget Tracking</a>
            <a href=''>Transactions</a>
            <button className='primary-button'>Login/SignUp</button>
        </div>
        <div className='navbar-menu-container'>
            <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
        </div>
        <Drawer open={openMenu} onClose={() => setOpenMenu(false)}
        anchor="right">
            <Box
                sx={{ width:250 }}
                role="presentation"
                onClick={() => setOpenMenu(false)}
                onKeyDown ={() => setOpenMenu(false)}
                >
                    <List>
                        {menuOption.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
            </Box>
        </Drawer>
    </nav>
    );
};

export default Navbar;

