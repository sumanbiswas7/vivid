import FontAwesome from "react-native-vector-icons/FontAwesome";
export function StarFill() {
  return (
    <FontAwesome
      style={{ marginRight: 3 }}
      name="star"
      size={15}
      color={"#000"}
    />
  );
}
export function StarOutline() {
  return (
    <FontAwesome
      style={{ marginRight: 3 }}
      name="star-o"
      size={15}
      color={"#000"}
    />
  );
}
export function StarFillWhite() {
  return (
    <FontAwesome
      style={{ marginRight: 3 }}
      name="star"
      size={13}
      color={"#fff"}
    />
  );
}

export function StarOutlineWhite() {
  return (
    <FontAwesome
      style={{ marginRight: 3 }}
      name="star-o"
      size={13}
      color={"#fff"}
    />
  );
}
