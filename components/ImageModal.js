import { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useTheme } from "@react-navigation/native";
import { actionCreators } from "../state";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

export function ImageModal(props) {
  const { toggleModal } = bindActionCreators(actionCreators, useDispatch());
  const modalVisible = useSelector((state) => state.modal.camera);
  console.log(modalVisible);
  const { colors } = useTheme();
  function handleCameraClick() {
    props.handleClick("camera");
    toggleModal({ camera: false, home: false });
  }
  function handleGalleryClick() {
    props.handleClick("gallery");
    toggleModal({ camera: false, home: false });
  }
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modal_view}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={handleCameraClick}>
              <EvilIcons
                style={{ marginBottom: 40, marginRight: 10 }}
                name="camera"
                size={90}
                color={"#fff"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGalleryClick}>
              <EvilIcons
                style={{ marginBottom: 40, marginLeft: 10 }}
                name="image"
                size={90}
                color={"#fff"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleModal({ camera: false, home: false })}
              activeOpacity={0.7}
              style={[styles.modal_footer, { backgroundColor: colors.modal }]}
            >
              <EvilIcons name="close" size={30} color={"#000"} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modal_view: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 300,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modal_footer: {
    width: "100%",
    height: 40,
    bottom: 0,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
