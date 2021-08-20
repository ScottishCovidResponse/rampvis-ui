import type { FC } from 'react';
import type { Theme } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import type { SxProps } from '@material-ui/system';

interface LogoProps {
  sx?: SxProps<Theme>;
}

const LogoRoot = experimentalStyled('svg')``;

const Logo: FC<LogoProps> = (props) => (
  <LogoRoot
    height="52"
    version="1.1"
    viewBox="0 0 52 52"
    width="52"
    {...props}
  >
    <title>T</title>
    <defs>
      <filter id="filter">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.262745 0 0 0 0 0.329412 0 0 0 0 0.866667 0 0 0 1.000000 0"
        />
      </filter>
    </defs>
    <g
      fill="none"
      stroke="none"
    >
      <g filter="url(#filter)">
        <g>
          <rect
            height="52"
            width="52"
            x="0"
            y="4.26325641e-14"
          />

 
        </g>
      </g>
    </g>
  </LogoRoot>
);

export default Logo;
