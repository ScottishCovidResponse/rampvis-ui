import type { FC } from "react";
import type { Theme } from "@material-ui/core";
import { experimentalStyled } from "@material-ui/core/styles";
import type { SxProps } from "@material-ui/system";

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
