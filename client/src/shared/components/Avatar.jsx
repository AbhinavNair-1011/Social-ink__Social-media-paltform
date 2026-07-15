function Avatar({ src , classname }) {
  return (
    <img
      src={
        src ||
        "https://placehold.co/100x100"
      }
      alt="Profile"
      className={`h-10 w-10 rounded-full object-cover ${classname}`}
    />
  );
}

export default Avatar;