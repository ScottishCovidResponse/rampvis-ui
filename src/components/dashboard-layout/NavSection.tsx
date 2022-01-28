import type { FC, ReactNode } from "react";
// import { matchPath } from 'react-router-dom';
import { matchPath } from "src/utils/matchPath";

import { List, ListSubheader, ListProps } from "@mui/material";
import NavItem from "./NavItem";

interface Item {
  path?: string;
  icon?: ReactNode;
  info?: ReactNode;
  children?: Item[];
  title?: string;
}

interface NavSectionProps extends ListProps {
  items: Item[];
  pathname: string;
  title?: string;
}

interface X {
  // TODO
  acc: JSX.Element[];
  pathname: string;
  item: Item;
  depth: number;
}

interface Y {
  // TODO
  items: Item[];
  pathname: string;
  depth?: number;
}

const renderNavItems = ({ depth = 0, items, pathname }: Y): JSX.Element => (
  <List disablePadding>
    {items.reduce(
      (acc, item) =>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        reduceChildRoutes({
          acc,
          item,
          pathname,
          depth,
        }),
      [],
    )}
  </List>
);

const reduceChildRoutes = ({
  acc,
  pathname,
  item,
  depth,
}: X): Array<JSX.Element> => {
  const key = `${item.title}-${depth}`;

  const exactMatch = matchPath(item.path, pathname).matches;
  if (item.children) {
    const partialMatch = matchPath(item.path, pathname).matches;

    acc.push(
      <NavItem
        active={partialMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={partialMatch}
        path={item.path}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          items: item.children,
          pathname,
        })}
      </NavItem>,
    );
  } else {
    acc.push(
      <NavItem
        active={exactMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        path={item.path}
        title={item.title}
      />,
    );
  }

  return acc;
};

const NavSection: FC<NavSectionProps> = (props) => {
  const { items, pathname, title, ...other } = props;

  return (
    <List
      subheader={
        <ListSubheader
          disableGutters
          disableSticky
          sx={{
            color: "text.primary",
            fontSize: "0.75rem",
            lineHeight: 2.5,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {title}
        </ListSubheader>
      }
      {...other}
    >
      {renderNavItems({
        items,
        pathname,
      })}
    </List>
  );
};

export default NavSection;
