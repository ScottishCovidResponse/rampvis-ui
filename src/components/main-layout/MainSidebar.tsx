import { useEffect, FC } from 'react';
// import { useLocation } from 'react-router-dom';
import Link from "next/link";
import { useRouter } from 'next/router'
import PropTypes from 'prop-types';
import { Box, Chip, Drawer } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logo from 'src/components/Logo';

interface MainSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const MainSidebar: FC<MainSidebarProps> = (props) => {
  const { onMobileClose, openMobile } = props;
  // const location = useLocation();
  const router = useRouter()
  const lgUp = useMediaQuery((theme: Theme) => theme?.breakpoints.up('lg'));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [router.asPath]);

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={!lgUp && openMobile}
      variant="temporary"
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          width: 256
        }
      }}
    >
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: 2
        }}
      >
        <Link href="/">
          <Logo />
        </Link>
        <Box
          sx={{
            display: 'flex',
            pb: 2,
            pt: 3
          }}
        >
          <Chip
            color="primary"
            label="NEW"
            size="small"
            sx={{
              maxHeight: 20,
              ml: 1,
              mr: 2
            }}
          />
        </Box>
       
      </Box>
    </Drawer>
  );
};

MainSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default MainSidebar;
