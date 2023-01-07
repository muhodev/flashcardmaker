import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "providers";
import { useState } from "react";

export default function Header() {
  const { openAuthModal, isLoggedIn, logout, user, isMounted } = useAuth();

  const [isLoggingOut, setLoggingOut] = useState(false);
  const openAuthModalHandler = () => openAuthModal();

  const logoutHandler = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="py-2 flex items-center justify-center border-b">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="font-bold">LOGO</h1>
        <nav className="flex items-center gap-x-4">
          <Button
            variant="link"
            as={Link}
            href="/explore"
            size="sm"
            color="gray.600"
            fontWeight="medium"
          >
            Explore
          </Button>
          {
            // for loading
          }
          {!isMounted || isLoggingOut ? (
            <SkeletonCircle size="8" />
          ) : !isLoggedIn ? (
            <Button
              size="sm"
              onClick={openAuthModalHandler}
              isLoading={!isMounted}
            >
              Login
            </Button>
          ) : (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  padding={0}
                  minWidth={0}
                  minHeight={0}
                  height="auto"
                  rounded={"full"}
                >
                  <Avatar
                    size="sm"
                    name={user?.displayName || user?.email || ""}
                    src={user?.photoURL || ""}
                  />
                </MenuButton>
                <MenuList fontSize={"sm"}>
                  <div className="flex items-center gap-x-2 px-3 py-[6px]">
                    <Avatar
                      size="sm"
                      height={"full"}
                      display="block"
                      name={user?.displayName || user?.email || ""}
                      src={user?.photoURL || ""}
                    />
                    <div className="flex-1">
                      <Text fontWeight="medium" fontSize={"sm"}>
                        {user?.displayName || "Anonymous"}
                      </Text>
                      <Text fontSize={"small"} color="gray.600">
                        {user?.email}
                      </Text>
                    </div>
                  </div>
                  <MenuDivider />
                  <MenuGroup>
                    <MenuItem>Profile</MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup>
                    <MenuItem>Blog</MenuItem>
                    <MenuItem>Feedback</MenuItem>
                    <MenuItem>What's new</MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup>
                    <MenuItem color="red" onClick={logoutHandler}>
                      Log out
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
