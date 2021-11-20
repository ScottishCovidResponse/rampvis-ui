import type { FC } from "react";
import type { Theme } from "@mui/material";
import { experimentalStyled } from "@mui/material";
import { SxProps } from "@mui/system";

interface LogoProps {
  sx?: SxProps<Theme>;
}

const LogoRoot = experimentalStyled("svg")``;

const Logo: FC<LogoProps> = (props) => (
  <LogoRoot
    height="454"
    version="1.1"
    viewBox="0 0 454 454"
    width="454"
    {...props}
  >
    <title>RAMPVIS</title>
    <image href="/static/logos/Logo454x454.png" />
  </LogoRoot>
);

export default Logo;
