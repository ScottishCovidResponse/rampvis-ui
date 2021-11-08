import type { FC } from "react";
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";
import RemoveIcon from "@material-ui/icons/Remove";
import Logo from "./Logo";

const sections = [
  {
    title: "Placeholders",
    links: [
      {
        title: "Contact",
        href: "#",
      },
    ],
  },
];

const Footer: FC = (props) => <></>;

export default Footer;
