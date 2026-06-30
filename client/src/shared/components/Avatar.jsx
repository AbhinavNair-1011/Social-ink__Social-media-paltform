function Avatar({ image }) {
  return (
    <img
      src={
        image ||
        "https://placehold.co/100x100"
      }
      alt="Profile"
      className="h-10 w-10 rounded-full object-cover"
    />
  );
}

export default Avatar;