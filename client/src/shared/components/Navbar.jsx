import Logo from "./Logo";
import Avatar from "./Avatar";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <Logo />

      <Avatar />
    </header>
  );
}

export default Navbar;