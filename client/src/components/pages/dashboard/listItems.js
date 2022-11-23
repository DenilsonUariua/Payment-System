import { Fragment, useContext, useEffect, useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";
import { UserContext } from "@context";

export const MainListItems = () => {
  const { user } = useContext(UserContext);
  const [showCustomer, setShowCustomer] = useState(false);
  useEffect(() => {
    if (user) {
      user.type === "Entrepreneur" && setShowCustomer(true);
    }
  }, [user]);
  return (
    <Fragment>
      <Link to="/dashboard">
        {" "}
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </Link>{" "}
      <Link to="/dashboard/orders">
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItemButton>
      </Link>{" "}
      {showCustomer && (
        <Link to="/dashboard/customers">
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItemButton>
        </Link>
      )}
    </Fragment>
  );
};
