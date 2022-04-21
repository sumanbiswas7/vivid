import { View, Text, StyleSheet, Linking } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";

export function UserAgreement({ handleAcceptState }) {
  const [acceptState, setAcceptState] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    handleAcceptState(acceptState);
  }, [acceptState]);

  return (
    <View style={styles.container}>
      <BouncyCheckbox
        isChecked={acceptState}
        disableBuiltInState
        onPress={() => setAcceptState(!acceptState)}
        fillColor={colors.gradient_2}
      />
      <Text style={acceptState ? { color: colors.text } : { color: "#6b6b6b" }}>
        I confirm that I have read, and agree to all rules on vivid's &nbsp;
        <Text
          onPress={() =>
            Linking.openURL(
              "https://sumanbiswas.vercel.app/apps/privacy-policy/vivid"
            )
          }
          style={{ color: colors.gradient_2 }}
        >
          Privacy Policy&nbsp;
        </Text>
        <Text>Page</Text>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: -50,
    marginHorizontal: 20,
  },
});
